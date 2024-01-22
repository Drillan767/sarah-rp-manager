import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase'

interface Channel {
    id: number
    name: string
    roleplay_id: string
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const supabase = await serverSupabaseClient<Database>(event)

    const channelsCreateList: Channel[] = []
    const channelsUpdateList: Channel[] = []

    body.forEach((channel: Channel) => {
        if (channel.id === 0)
            channelsCreateList.push(channel)
        else
            channelsUpdateList.push(channel)
    })

    // Creating new channels.
    await supabase
        .from('channels')
        .insert(channelsCreateList.map(c => ({
            roleplay_id: c.roleplay_id,
            name: c.name,
            private: false,
            allowed_roles: null,
            internal: true,
        })))

    // Updating existing ones.
    for (const r of channelsUpdateList) {
        const { id, ...fields } = r
        await supabase
            .from('channels')
            .update(fields)
            .eq('id', id)
    }

    return body
})
