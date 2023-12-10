import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const supabase = await serverSupabaseClient<Database>(event)

    const { data } = await supabase
        .from('characters')
        .select('id, roles(roleplay_id)')
        .eq('user_id', body.user_id)
        .eq('roles.roleplay_id', body.roleplay_id)

    if (!data)
        return

    await supabase
        .from('characters')
        .delete()
        .in('id', data.map(d => d.id))

    await supabase
        .from('blacklists')
        .insert({
            roleplay_id: body.roleplay_id,
            user_id: body.user_id,
            reason: body.reason,
        })

    return body
})
