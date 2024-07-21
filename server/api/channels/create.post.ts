import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const supabase = await serverSupabaseClient<Database>(event)

    await supabase
        .from('channels')
        .insert({
            name: body.name,
            roleplay_id: body.rpId,
            allowed_roles: [],
            internal: false,
            is_default: false,
        })

    return body
})
