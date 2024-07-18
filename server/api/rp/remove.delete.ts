import type { Database } from '~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const { rpId } = await readBody<{ rpId: string }>(event)

    const supabase = await serverSupabaseClient<Database>(event)

    // List related medias from the RP
    const { data: files } = await supabase
        .storage
        .from('roleplays')
        .list(rpId)

    // TODO: check if this also deletes children directories.
    // Delete said media.
    for (const file of files ?? []) {
        await supabase
            .storage
            .from('roleplays')
            .remove([`${rpId}/${file.name}`])
    }

    // Delete roleplay
    await supabase
        .from('roleplays')
        .delete()
        .eq('id', rpId)

    return rpId
})
