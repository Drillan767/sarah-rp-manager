import type { Database } from '@/types/supabase'
import { serverSupabaseClient } from '#supabase/server'


export default defineEventHandler(async (event) => {
    if (!isMethod(event, 'POST')) {
        throw createError({
            statusCode: 404,
        })
    }

    const body = await readBody(event)
    const supabase = serverSupabaseClient<Database>(event)

    const { data } = await supabase
        .from('roleplays')
        .insert(body)
        .select('id')

    if (data) {
        const [{id: rpId}] = data

        const { error } = await supabase
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
