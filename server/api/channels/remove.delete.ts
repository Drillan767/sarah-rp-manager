import { serverSupabaseClient } from '#supabase/server';
import type { Database } from '~/types/supabase'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const supabase = await serverSupabaseClient<Database>(event)

    // List all related media in storage.
    const { data: files } = await supabase
        .storage
        .from('messages')
        .list(body.id)

    // Delete said media.
    for (const file of files ?? []) {
        await supabase
            .storage
            .from('messages')
            .remove([`${body.id}/${file.name}`])
    }

    // Delete the channel.
    await supabase
        .from('channels')
        .delete()
        .eq('id', body.id)

    return body

})
