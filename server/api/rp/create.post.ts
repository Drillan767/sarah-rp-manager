import * as process from 'node:process'
import multipartFormHandler from '~/server/api/multipartFormHandler'

const supabase_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/roleplays`

export default defineEventHandler(async (event) => {
    const { payload, supabase, body } = await multipartFormHandler(event)
    // Storing initial values into Supabase.
    const { data, error } = await supabase
        .from('roleplays')
        .insert({
            title: payload.title,
            description: payload.description,
            illustration: '',
            public: payload.public === '1',
            start_date: payload.start_date ?? null,
            user_id: Number.parseInt(payload.user_id),
        })
        .select('id')

    if (error)
        throw createError({ statusCode: 400, message: error.message })

    const [{ id: rpId }] = data

    const mediaData = body.find(field => field.name === 'illustration')!

    const rpPath = `${rpId}/${mediaData.name}`

    // Uploading illustration.
    const { error: uploadError } = await supabase
        .storage
        .from('roleplays')
        .upload(rpPath, mediaData.data, {
            cacheControl: '3600',
            contentType: `${mediaData.type};charset=UTF-8`,
        })

    if (uploadError)
        throw createError({ statusCode: 400, message: uploadError.message })

    // Updating rp with illustration path.
    const { error: updateError } = await supabase
        .from('roleplays')
        .update({
            illustration: `${supabase_url}/${rpPath}`,
        })
        .eq('id', rpId)

    if (updateError)
        throw createError({ statusCode: 400, message: updateError.message })

    const { error: channelError } = await supabase
        .from('channels')
        .insert([
            {
                name: 'Canal principal',
                roleplay_id: rpId,
                internal: true,
            },
            {
                name: 'Canal secondaire',
                roleplay_id: rpId,
                internal: true,
            },
        ])

    if (channelError)
        throw createError({ statusCode: 400, message: channelError.message })

    return rpId
})
