import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const supabase = await serverSupabaseClient<Database>(event)

    const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', body.id)

    if (error) {
        throw createError({
            statusCode: 400,
            statusMessage: error.message,
        })
    }

    return body
})
