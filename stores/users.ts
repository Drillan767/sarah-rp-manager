import { defineStore } from "pinia"

export const useUserStore = defineStore('user', () => {

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