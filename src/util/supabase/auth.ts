import supabase from '.'

export async function login() {
    await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
            redirectTo: import.meta.env.VITE_WEBSITE_URL,
        },
    })
}

export async function logout() {
    await supabase.auth.signOut()
}
