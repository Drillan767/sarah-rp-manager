import type { Tables } from '@/types/database'
import supabase from '../supabase'

export type Channel = Tables<'channels'>

export async function createDefaultChannels(rpId: string) {
    const { error: channelError } = await supabase
        .from('channels')
        .insert([
            {
                name: 'Canal principal',
                is_default: true,
                is_internal: true,
                created_at: new Date().toISOString(),
                roleplay_id: rpId,
            },
            {
                name: 'Canal secondaire',
                is_default: true,
                is_internal: true,
                created_at: new Date().toISOString(),
                roleplay_id: rpId,
            },
        ])

    if (channelError)
        console.error('Error inserting channel(s)', channelError)
}
