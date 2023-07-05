import { defineStore } from "pinia"

export const useUserStore = defineStore('user', () => {

    /*
        Step 1 : fetch user on login
        Step 2 : if no user, get only email, fill the rest with default data / profile pic
        Step 3 : On info update, store info both in Pinia and Supabase.
        Step 4 : ... Logout I guess.
    */

    const auth = useSupabaseAuthClient()
    const client = useSupabaseClient()
    const session = useSupabaseUser();
    const router = useRouter()

    const loggedIn = computed(() => session !== null)

    async function logout() {
        await auth.auth.signOut();
        router.push('/connexion')
    }

    return {
        session,
        loggedIn,
        logout,
    }
}, { persist: true })