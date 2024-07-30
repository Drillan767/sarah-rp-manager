import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const supabase = await serverSupabaseClient<Database>(event)

    const { data } = await supabase
        .from('channels')
        .insert({
            name: body.name,
            roleplay_id: body.rpId,
            allowed_roles: [],
            internal: false,
            is_default: false,
        })
        .select('id')

    console.log(data)

    if (data) {
        const { data: cu } = await supabase
            .from('channels_users')
            .insert([
                {
                    channel_id: data[0].id,
                    user_id: body.user_id,
                },
                {
                    channel_id: data[0].id,
                    user_id: body.current_user,
                },
            ])
            .select()

        console.log({ cu })
    }

    return body
})
