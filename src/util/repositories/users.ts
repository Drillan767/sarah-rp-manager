import type { User } from '@supabase/supabase-js'
import type { CurrentUser } from '@/types/users'
import supabase from '../supabase'

export async function createUser(sessionUser: User, userData: CurrentUser) {
    const { error } = await supabase
        .from('users')
        .insert({
            id: sessionUser.id,
            avatar: userData.avatar,
            username: userData.username,
            email: sessionUser.email || '',
            description: '',
            handle: userData.handle,
            is_admin: false,
            created_at: new Date().toISOString(),
        })

    if (error) {
        console.error('Error creating user:', error)
    }
}

export async function getUserInfos(id: string) {
    const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

    return data
}

export async function updateUserInfos(id: string, avatar: string, username: string, handle: string) {
    const { error } = await supabase
        .from('users')
        .update({
            avatar,
            username,
            handle,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating user:', error)
    }
}

export async function updateDescription(id: string, description: string) {
    const { error } = await supabase
        .from('users')
        .update({
            description,
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating user:', error)
    }
}
