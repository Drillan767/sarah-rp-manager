import * as process from 'node:process'
import type { Database } from '@/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

const supabaseUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/roleplays`

// TODO: si nouvelle image, l'uploader
// Sinon updater tout sauf roles et illustration

export default defineEventHandler(async (event) => {
    const body = await readMultipartFormData(event)

    if (!body) {
        throw createError({
            statusCode: 400,
        })
    }

    const supabase = serverSupabaseClient<Database>(event)

    const payload: Record<string, string> = {}

    for (const field of body) {
        const fieldName = field.name!.toString()
        if (fieldName !== 'illustration')
            payload[fieldName] = field.data.toString()
    }

    const mediaData = body.find(field => field.name === 'illustration')

    if (mediaData) {
        // List all files from directory
        const { data: files } = await supabase
            .storage
            .from('roleplays')
            .list(`${payload.id}`)

        // Cleanup roleplay's storage directory
        files?.forEach(async (file) => {
            await supabase
                .storage
                .from('roleplays')
                .remove([`${payload.id}/${file.name}`])
        })

        // Upload new illustration
        await supabase
            .storage
            .from('roleplays')
            .upload(`${payload.id}/${mediaData.filename}`, mediaData.data, {
                cacheControl: '3600',
                contentType: `${mediaData.type};charset=UTF-8`,
            })

        payload.illustration = `${supabaseUrl}/${payload.id}/${mediaData.filename}`
    }

    const rpId = payload.id
    delete payload.id

    await supabase
        .from('roleplays')
        .update(payload)
        .eq('id', rpId)

    return {
        payload,
    }
})
