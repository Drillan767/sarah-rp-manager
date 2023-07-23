import type { Database } from '@/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

const supabaseUrl = process.env.SUPABASE_URL + '/storage/v1/object/public/roleplays'

export default defineEventHandler(async (event) => {
    if (!isMethod(event, 'POST')) {
        throw createError({
            statusCode: 404,
        })
    }

    const body = await readMultipartFormData(event)

    if (!body) {
        throw createError({
            statusCode: 400,
        })
    }

    const supabase = serverSupabaseClient<Database>(event)

    const payload: Record<string, string> = {}
    let roleList: { name: string, max_users: number }[] = []

    for (const field of body) {
        const fieldName = field.name!.toString()
        if (fieldName !== 'illustration') {
            if (fieldName === 'roles') {
                roleList = JSON.parse(field.data.toString())
            } else {
                payload[fieldName] = field.data.toString()
            }
        }
    }

    const { data } = await supabase
        .from('roleplays')
        .insert({
            title: payload.title,
            description: payload.description,
            illustration: '',
            start_date: payload.start_date,

        })
        .select('id')


    if (!data) {
        throw createError({
            statusCode: 400,
        })
    }

    const [{ id: rpId }] = data


    const mediaData = body.find((field) => field.name === 'illustration')!

    const rpPath = `${rpId}/${mediaData.filename}`

    const { error: uploadError } = await supabase
        .storage
        .from('roleplays')
        .upload(rpPath, mediaData.data, {
            cacheControl: '3600',
            contentType: `${mediaData.type};charset=UTF-8`
        })

    if (uploadError) {
        throw createError({
            statusCode: 400,
            message: uploadError.message
        })
    }

    const { error: rpError } = await supabase
        .from('roleplays')
        .update({
            illustration: `${supabaseUrl}/${rpPath}`
        })
        .eq('id', rpId)

    if (rpError) {
        throw createError({
            statusCode: 400,
            message: rpError.message
        })
    }

    const { error: channelError } = await supabase
        .from('channels')
        .insert([
            {
                name: 'Principal',
                roleplay_id: rpId,
                private: false,
            },
            {
                name: 'Secondaire',
                roleplay_id: rpId,
                private: false,
            }
        ])

    if (channelError) {
        throw createError({
            statusCode: 400,
            message: channelError.message
        })
    }

    const roles = roleList.map((r) => ({
        name: r.name,
        max_users: r.max_users,
        roleplay_id: rpId,
    }))

    const { error: roleError } = await supabase
        .from('roles')
        .insert(roles)

    if (roleError) {
        throw createError({
            statusCode: 400,
            message: roleError.message
        })
    }

    return {
        id: rpId
    }
})
