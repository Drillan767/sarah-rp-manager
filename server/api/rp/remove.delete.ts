import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const { id } = await readBody(event)
    const supabase = await serverSupabaseClient<Database>(event)

    const { error } = await supabase
        .from('roleplays')
        .delete()
        .eq('id', id)

    if (error) {
        throw createError({
            statusCode: 400,
            statusMessage: error.message,
        })
    }

    return 'ok'
})
