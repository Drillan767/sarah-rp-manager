import type { User } from '@supabase/supabase-js'
import type { Tables } from '@/types/database'
import type { CurrentUser, UserMetadata } from '@/types/users'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { createUser, getUserInfos, updateUserInfos } from '@/util/repositories/users'
import supabase from '@/util/supabase'

const useAuthStore = defineStore('auth', () => {
    const session = ref<User | null>(null)
    const currentUser = ref<CurrentUser>()
    const profile = ref<Tables<'users'>>()
    const loading = ref(true)

    const isAuthenticated = computed(() => !!currentUser.value)

    function extractCurrentUser(user: User | null): CurrentUser | undefined {
        if (!user?.user_metadata)
            return undefined

        const metadata = user.user_metadata as UserMetadata
        return {
            id: user.id,
            avatar: metadata.avatar_url || metadata.picture || '',
            handle: `@${metadata.user_name}`,
            username: metadata.full_name || metadata.name || '',
            is_admin: 'false',
        }
    }

    async function initialize() {
        // Initial session.
        const { data: { user } } = await supabase.auth.getUser()
        session.value = user
        currentUser.value = extractCurrentUser(user)

        if (user) {
            await createUserIfNotExist(user, currentUser.value)
            await fetchProfile()
        }

        loading.value = false

        // Listen to auth change.
        supabase.auth.onAuthStateChange(async (event, authSession) => {
            switch (event) {
                case 'SIGNED_IN':
                    session.value = authSession?.user ?? null
                    currentUser.value = extractCurrentUser(authSession?.user ?? null)
                    await createUserIfNotExist(authSession?.user, currentUser.value)
                    await fetchProfile()
                    break

                case 'SIGNED_OUT':
                    session.value = null
                    currentUser.value = undefined
                    profile.value = undefined
                    break
            }
        })
    }

    const signIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'twitter',
            options: {
                redirectTo: import.meta.env.VITE_WEBSITE_URL,
            },
        })
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    async function fetchProfile() {
        if (!session.value?.id)
            return
        const data = await getUserInfos(session.value.id)

        if (!data) {
            console.error('Could not fetch user\'s data')
            return
        }

        profile.value = data
    }

    async function createUserIfNotExist(sessionUser?: User, userData?: CurrentUser) {
        if (!sessionUser || !userData)
            return

        const existingUser = await getUserInfos(sessionUser.id)

        if (existingUser) {
            // Check if avatar or username has changed and update if needed
            const needsUpdate
                = existingUser.avatar !== userData.avatar
                    || existingUser.username !== userData.username

            if (needsUpdate) {
                await updateUserInfos(
                    sessionUser.id,
                    userData.avatar,
                    userData.username,
                    userData.handle,
                )
            }
        }
        else {
            await createUser(sessionUser, userData)
        }
    }

    return {
        user: currentUser,
        isAuthenticated,
        profile,
        session,
        loading,
        signIn,
        signOut,
        initialize,
    }
})

export default useAuthStore
