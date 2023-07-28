import * as process from 'node:process'
import type { Database } from '@/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

const supabaseUrl = process.env.SUPABASE_URL

export default defineEventHandler(async (event) => {
    const body = await readMultipartFormData(event)
    const supabase = serverSupabaseClient<Database>(event)

    if (!body) {
        throw createError({
            statusCode: 400,
        })
    }

    const payload: Record<string, string> = {}

    for (const field of body) {
        const fieldName = field.name!.toString()
        if (fieldName !== 'media') {
            if (fieldName === 'availability')
                payload.availability = JSON.parse(field.data.toString())
            else
                payload[fieldName] = field.data.toString()
        }
    }

    const mediaData = body.find(field => field.name === 'media')

    if (mediaData) {
        const avatarPath = `${payload.session_id}/profile/${mediaData.filename}`

        // Cleanup user avatar directory
        await supabase
            .storage
            .from('avatars')
            .remove([`${payload.session_id}/profile`])

        // Upload new avatar
        await supabase
            .storage
            .from('avatars')
            .upload(avatarPath, mediaData.data, {
                cacheControl: '3600',
                contentType: `${mediaData.type};charset=UTF-8`,
            })

        payload.image_url = `${supabaseUrl}/storage/v1/object/public/avatars/${avatarPath}`
    }

    const { session_id, ...fields } = payload

    await supabase
        .from('users')
        .update(fields)
        .eq('session_id', session_id)

    return { payload }
})
