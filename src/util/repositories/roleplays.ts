import type { Role } from './roles'
import type { Tables } from '@/types/database'
import supabase from '../supabase'
import { createDefaultChannels } from './channels'
import { createRoles } from './roles'

export type Roleplay = Tables<'roleplays'>

export async function listRoleplays() {
    const { data } = await supabase
        .from('roleplays')
        .select('*')

    if (!data) {
        console.error('Could not fetch roleplays')
        return []
    }

    return data
}

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

export async function createRoleplay(
    rp: Omit<Roleplay, 'created_at' | 'illustration'>,
    image: File,
    roles: Omit<Role, 'roleplay_id' | 'created_at'>[],
) {
    // Create initial roleplay
    const { error: rpError, data: rpData } = await supabase
        .from('roleplays')
        .insert({
            ...rp,
            illustration: '',
        })
        .select()

    if (rpError || !rpData) {
        console.error('Error inserting roleplay', rpData)
        return
    }

    const rpId = rpData[0].id

    // Upload image
    const { data: file, error: fileError } = await supabase.storage
        .from('images')
        .upload(`roleplays/${rpId}`, image, {
            contentType: image.type,
            cacheControl: '3600',
        })

    if (fileError || !file) {
        console.error('Error uploading the image', fileError)
        return
    }

    // Update rp with the file's path

    await supabase
        .from('roleplays')
        .update({
            illustration: file.fullPath,
        })
        .eq('id', rpId)

    await createRoles(roles, rpId)

    // Create default channels
    await createDefaultChannels(rpId)

    return rpId
}
