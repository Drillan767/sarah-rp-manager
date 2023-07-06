import type { User } from "types"
import { defineStore } from "pinia"

const defaultUser = {
    username: 'Utilisateur anonyme',
    is_admin: false,
    description: '',
    image_url: 'https://sarah-rp-manager.vercel.app/default-avatar.webp',
    availability: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
    }
}

export const useUserStore = defineStore('user', () => {

    const auth = useSupabaseAuthClient()
    const client = useSupabaseClient()
    const session = useSupabaseUser();
    const router = useRouter()

    /*
        Step 1 : fetch user on login
        Step 2 : if no user, get only email, fill the rest with default data / profile pic
        Step 3 : On info update, store info both in Pinia and Supabase.
        Step 4 : ... Logout I guess.
    */



    const user = ref<User>({} as User)
    const loggedIn = computed(() => session !== null)

    async function initSession() {
        const sessId = session.value!.id
        const sessEmail = session.value?.email
        const { data: fetchedUser } = await useAsyncData<User|null>('user', async() => {
            const { data } = await client
                .from('users')
                .select('*')
                .eq('session_id', sessId)
                .single()

            return data
        })

        user.value = fetchedUser.value ?? { ...defaultUser, session_id: sessId, email: sessEmail ?? '' }
    }

    async function updateProfile(formData: FormData) {
        const { data, error} = await useFetch('/api/profile/update', {
            method: 'POST',
            body: formData
        })

        console.log(data, error)
    }

    async function logout() {
        await auth.auth.signOut();
        router.push('/connexion')
    }

    function checkFromServer() {
        console.log('Yep I got reached from back end')
    }

    return {
        initSession,
        user,
        updateProfile,
        session,
        loggedIn,
        logout,
        
    }
}, { persist: true })