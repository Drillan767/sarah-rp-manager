import type { Database } from '~/types/supabase';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const body = await readBody<{ id: number, decision: number }>(event)

    const supabase = await serverSupabaseClient<Database>(event)

    await supabase
        .from('characters')
        .update({ status: body.decision })
        .eq('id', body.id)

    return body
})
