import { defineStore } from "pinia"

export const useUserStore = defineStore('user', () => {

    const auth = useSupabaseAuthClient()
    const router = useRouter();
    const client = useSupabaseClient()
    const session = useSupabaseUser();

    const loggedIn = computed(() => session !== null)

    function logout() {
        auth.auth.signOut();
        router.push('/connexion')
    }

    return {
        session,
        loggedIn,
        logout,
    }
}, { persist: true })