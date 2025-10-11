import type { Tables } from '@/types/database'
import supabase from '../supabase'

export type Roleplay = Tables<'roleplays'>

export async function listRpForUser(user: string) {
    const { data } = await supabase
        .from('roleplays')
        .select('*')
        .eq('user_id', user)

    if (!data) {
        console.error('Could not fetch roleplays')
        return []
    }

    return data
}

export async function createRoleplay(rp: Roleplay) {

}
