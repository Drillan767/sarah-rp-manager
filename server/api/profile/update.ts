import type { Database } from '@/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

const supabaseUrl = process.env.SUPABASE_URL

export default defineEventHandler(async (event) => {
    if (!isMethod(event, 'POST')) {
        throw createError({
            statusCode: 404,
        })
    }

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
            if (fieldName === 'availability') {
                payload['availability'] = JSON.parse(field.data.toString())
            } else {
                payload[fieldName] = field.data.toString()
            }
        }
    }

    const mediaData = body.find((field) => field.name === 'media')

    if (mediaData) {
        const avatarPath = `avatars/${payload.session_id}/${mediaData.filename}`

        // Cleanup user avatar directory
        const { error: deleteError } = await supabase
            .storage
            .from('medias')
            .remove([`avatars/${payload.session_id}`])

        // Upload new avatar
        const { error: uploadError } = await supabase
            .storage
            .from('medias')
            .upload(avatarPath, mediaData.data)

        payload.image_url = `${supabaseUrl}/storage/v1/object/public/medias/${avatarPath}`
    }

    // Checks if user exists in database
    const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

    if (count && count > 0) {
        const {session_id, ...fields } = payload

        await supabase
            .from('users')
            .update(fields)
            .eq('session_id', session_id)

    } else {
        const { session_id, email, username, description } = payload
        await supabase
            .from('users')
            .insert({
                session_id,
                email,
                is_admin: false,
                availability: {},
                username,
                description,
                created_at: new Date().toDateString()
            })

    }

    return { payload }

})