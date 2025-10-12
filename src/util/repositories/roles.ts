import type { Tables } from '@/types/database'
import supabase from '../supabase'

export type Role = Tables<'roles'>

export async function createRoles(roles: Omit<Role, 'roleplay_id' | 'created_at'>[], rpId: string) {
    // Create related roles
    const { error: roleError } = await supabase
        .from('roles')
        .insert(
            roles.map(r => ({
                ...r,
                created_at: new Date().toISOString(),
                roleplay_id: rpId,
            })),
        )

    if (roleError) {
        console.error('Error inserting role(s)', roleError)
    }
}
