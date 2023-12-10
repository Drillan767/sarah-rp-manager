import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase'

interface CreatedChannel {
    name: string
    roleplay_id: string
}

interface Channel extends CreatedChannel {
    id: number
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const supabase = await serverSupabaseClient<Database>(event)

    const channelsCreateList: CreatedChannel[] = []
    const channelsUpdateList: Channel[] = []

    body.forEach((channel: CreatedChannel | Channel) => {
        if ('id' in channel)
            channelsUpdateList.push(channel)
        else
            channelsCreateList.push(channel)
    })

    // Creating new channels.
    await supabase
        .from('channels')
        .insert(channelsCreateList)

    // Updating existing ones.
    for (const r of channelsUpdateList) {
        const { id, ...fields } = r
        await supabase
            .from('roles')
            .update(fields)
            .eq('id', id)
    }
})
