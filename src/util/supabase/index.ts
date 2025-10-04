import { createClient } from '@supabase/supabase-js'

export default createClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_KEY)

/*

export default function useSupabase() {
    async function login() {
        await supabase.auth.signInWithOAuth({
            provider: 'twitter',
            options: {
                redirectTo: import.meta.env.VITE_URL,
            },
        })
    }

    async function logout() {
        await supabase.auth.signOut()
    }

    return {
        supabase,
        login,
        logout,
    }
}
*/
