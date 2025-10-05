import type { User } from '@supabase/supabase-js'
import type { Tables } from '@/types/database'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import supabase from '@/util/supabase'

const useAuthStore = defineStore('auth', () => {
    const currentUser = ref<User | null>(null)
    const profile = ref<Tables<'users'>>()
    const loading = ref(true)

    async function initialize() {
        // Initial session.
        const { data: { user } } = await supabase.auth.getUser()
        currentUser.value = user

        if (user) {
            await fetchProfile()
        }

        loading.value = false

        // Listen to auth change.
        supabase.auth.onAuthStateChange(async (event, session) => {
            switch (event) {
                case 'SIGNED_IN':
                    console.log({
                        session: session?.user,
                    })
                    currentUser.value = session?.user ?? null
                    await fetchProfile()
                    break

                case 'SIGNED_OUT':
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
        if (!currentUser.value)
            return
        const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentUser.value.id)
            .single()

        if (!data) {
            console.error('Could not fetch user\'s data')
            return
        }

        profile.value = data
    }

    return {
        user: currentUser,
        signIn,
        signOut,
        initialize,
    }
})

export default useAuthStore
