import type { Database } from "types/supabase"
import type { User } from "types"
import { defineStore } from "pinia"

export const useUserStore = defineStore('user', () => {

    const client = useSupabaseClient<Database>()
    const session = useSupabaseUser();
    const router = useRouter()

    const user = ref<User>({} as User)
    const loggedIn = computed(() => session !== null)

    async function login(email: string, password: string) {
        const { error: errResponse, data } = await client.auth.signInWithPassword({
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
        if (session.value) {
            const sessId = session.value.id

            const { data } = await client
                .from('users')
                .select('*')
                .eq('session_id', sessId)
                .maybeSingle()

            console.log(data)

            if (data) {
                const { image_url, description, session_id, availability, ...fields } = data
                user.value = {
                    description: description ?? '',
                    session_id: sessId,
                    image_url: image_url ?? 'https://sarah-rp-manager.vercel.app/default-avatar.webp',
                    availability,
                    ...fields
                }
            } else {
                const { user_metadata } = session.value

                const payload = {
                    is_sarah: false,
                    session_id: sessId,
                    email: user_metadata.email,
                    username: user_metadata.username,
                    description: user_metadata.description,
                    availability: user_metadata.availability,
                    image_url: 'https://sarah-rp-manager.vercel.app/default-avatar.webp',
                }

                await client
                    .from('users')
                    .insert(payload)

                // Removing user_metadata.
                await client.auth.updateUser({})

                user.value = payload
            }
        }
    }

    async function updateProfile(formData: FormData) {
        await useFetch('/api/profile/update', {
            method: 'POST',
            body: formData
        })

        await initSession()
    }

    async function updatePassword(newPassword: string) {
        await client.auth.updateUser({ password: newPassword })
    }

    async function logout() {
        await client.auth.signOut();
        localStorage.clear();
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