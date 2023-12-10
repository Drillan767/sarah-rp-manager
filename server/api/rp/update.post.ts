import process from 'node:process'
import multipartFormHandler from '~/server/api/multipartFormHandler'

const supabaseUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/roleplays`

export default defineEventHandler(async (event) => {
    const { payload, supabase, body } = await multipartFormHandler(event)

    const mediaData = body.find(field => field.name === 'illustration')

    if (mediaData) {
        // List all files from directory
        const { data: files } = await supabase
            .storage
            .from('roleplays')
            .list(payload.id)

        // Remove current image.
        for (const file of files ?? []) {
            await supabase
                .storage
                .from('roleplays')
                .remove([`${payload.id}/${file.name}`])
        }

        // Upload new image
        await supabase
            .storage
            .from('roleplays')
            .upload(`${payload.id}/${mediaData.filename}`, mediaData.data, {
                cacheControl: '3600',
                contentType: `${mediaData.type};charset=UTF-8`,
            })

        payload.illustration = `${supabaseUrl}/${payload.id}/${mediaData.filename}`
    }

    const { id, ...fields } = payload

    // Update with new data.
    await supabase
        .from('roleplays')
        .update(fields)
        .eq('id', id)

    return payload
})
