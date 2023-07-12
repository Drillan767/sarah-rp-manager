import type { User } from "types"
import { defineStore } from "pinia"

const defaultUser = {
    username: 'Utilisateur anonyme',
    is_sarah: false,
    description: '',
    image_url: 'https://sarah-rp-manager.vercel.app/default-avatar.webp',
    availability: {
        Lundi: [],
        Mardi: [],
        Mercredi: [],
        Jeudi: [],
        Vendredi: [],
        Samedi: [],
        Dimanche: [],
    }
}

export const useUserStore = defineStore('user', () => {

    const authClient = useSupabaseAuthClient()
    const client = useSupabaseClient()
    const session = useSupabaseUser();
    const router = useRouter()

    const user = ref<User>({} as User)
    const loggedIn = computed(() => session !== null)

    async function login(email: string, password: string) {
        const { error: errResponse, data } = await authClient.auth.signInWithPassword({
            email,
            password
        })

        if (data.session || data.user) {
            await initSession()
            router.push('/')
        }

        if (errResponse) {
            return errResponse.message
        }
    }

    async function initSession() {
        const sessId = session.value!.id
        const sessEmail = session.value?.email
        const { data: fetchedUser } = await useAsyncData<User | null>('fetchedUser', async () => {
            const { data } = await client
                .from('users')
                .select('*')
                .eq('session_id', sessId)
                .maybeSingle()

            return data
        })

        user.value = fetchedUser.value ?? { ...defaultUser, session_id: sessId, email: sessEmail ?? '' }
    }

    async function updateProfile(formData: FormData) {
        await useFetch('/api/profile/update', {
            method: 'POST',
            body: formData
        })

        await initSession()
    }

    async function updatePassword(newPassword: string) {
        await authClient.auth.updateUser({ password: newPassword })
    }

    async function logout() {
        await authClient.auth.signOut();
        router.push('/connexion')
    }

    return {
        login,
        user,
        updateProfile,
        updatePassword,
        session,
        loggedIn,
        logout,
    }
},
    {
        persist: {
            storage: persistedState.localStorage,
        },
    })