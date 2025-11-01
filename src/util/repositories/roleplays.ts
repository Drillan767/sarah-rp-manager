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
    rp: Omit<Roleplay, 'id' | 'created_at' | 'illustration'>,
    image: File,
    roles: Omit<Role, 'id' | 'roleplay_id' | 'created_at'>[],
) {
    let rpId: string | null = null
    let uploadedFilePath: string | null = null

    try {
        // Create initial roleplay
        const { error: rpError, data: rpData } = await supabase
            .from('roleplays')
            .insert({ ...rp, illustration: '' })
            .select()

        if (rpError || !rpData) {
            throw new Error(`Failed to create roleplay: ${rpError?.message}`)
        }

        rpId = rpData[0].id

        // Upload image
        const { data: file, error: fileError } = await supabase.storage
            .from('images')
            .upload(`roleplays/${rpId}`, image, {
                contentType: image.type,
                cacheControl: '3600',
            })

        if (fileError || !file) {
            throw new Error(`Failed to upload image: ${fileError?.message}`)
        }

        uploadedFilePath = file.fullPath

        // Update rp with the file's path
        const { error: updateError } = await supabase
            .from('roleplays')
            .update({ illustration: file.fullPath })
            .eq('id', rpId)

        if (updateError) {
            throw new Error(`Failed to update illustration: ${updateError.message}`)
        }

        // Create roles
        await createRoles(roles, rpId)

        // Create default channels
        await createDefaultChannels(rpId)

        return rpId
    }
    catch (error) {
        // Cleanup: delete roleplay if it was created
        if (rpId) {
            await supabase.from('roleplays').delete().eq('id', rpId)
        }

        // Cleanup: delete uploaded file if it exists
        if (uploadedFilePath) {
            await supabase.storage.from('images').remove([uploadedFilePath])
        }

        console.error('Error creating roleplay:', error)
        throw error // Re-throw so caller knows it failed
    }
}
