import * as process from 'node:process'
import multipartFormHandler from '~/server/api/multipartFormHandler'
import { serverSupabaseUser } from '#supabase/server'

const supabaseUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/avatars`

export default defineEventHandler(async(event) => {
    const { payload, supabase, body} = await multipartFormHandler(event)
    let illustration = ''

    const currentUser = await serverSupabaseUser(event)

    const { name, description, user_id, role_id, status, action } = payload

    if (action === 'create') {
        const mediaData = body.find(field => field.name === 'illustration')!

        const { error: uploadError } = await supabase
            .storage
            .from('avatars')
            .upload(`${currentUser?.id}/avatars/${mediaData.filename}`, mediaData.data, {
                cacheControl: '3600',
                contentType: `${mediaData.type};charset=UTF-8`,
            })

        if (uploadError) throw createError({ statusCode: 400, message: uploadError.message })

        illustration = `${supabaseUrl}/${currentUser?.id}/avatars/${mediaData.filename}`
    } else {
        const media = body.find(field => field.name === 'illustration')!
        illustration = media.data.toString()
    }

    await supabase
        .from('characters')
        .insert({
            name,
            description,
            user_id: parseInt(user_id),
            role_id: parseInt(role_id),
            status: parseInt(status),
            illustration,
        })

    return payload
})
