import type { Database } from '@/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

type Request = {
    title: string,
    description: string,
    start_date: string,
    roles: {
        name: string,
        max_users: number
    }[]
}

export default defineEventHandler(async (event) => {
    if (!isMethod(event, 'POST')) {
        throw createError({
            statusCode: 404,
        })
    }

    const { title, description, roles } = await readBody<Request>(event)
    const supabase = serverSupabaseClient<Database>(event)

    const { data, error } = await supabase
        .from('roleplays')
        .insert({
            title,
            description
        })
        .select('id')

    if (data) {
        const [{id: rpId}] = data

        const { error: rolesError } = await supabase
            .from('roles')
            .insert(roles.map((r) => ({ ...r, roleplay_id: rpId })))


        const { error: channelErrors } = await supabase
            .from('channels')
            .insert([
                {
                    roleplay_id: rpId,
                    name: 'Principal',
                },
                {
                    roleplay_id: rpId,
                    name: 'Secondaire',
                }
            ])
    }

    setResponseStatus(event, 200)
})
