import { storeToRefs } from 'pinia'
import useUsersStore from '@/stores/auth'
import supabase from '@/util/supabase'
import useUser from './user'

export default function useAuth() {
    const { user: storeUser } = storeToRefs(useUsersStore())
    const { createUserIfNotExists } = useUser()

    const initAuth = () => {
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                console.log({ session })
            }
        })
        /*
        const unsubscribe = onAuthStateChanged(auth, async (user: TwitterUser | null) => {
            if (user) {
                await createUserIfNotExists({
                    uid: user.uid,
                    username: user.displayName || '',
                    handle: `@${user.reloadUserInfo?.screenName}`,
                    email: user.email || '',
                    avatar: user.photoURL || '',
                    role: 'USER',
                })

                storeUser.value = {
                    id: user.uid,
                    handle: `@${user.reloadUserInfo?.screenName}`,
                    username: user.displayName || '',
                    avatar: user.photoURL || '',
                }
            }
            else {
                storeUser.value = undefined
            }
        })

        return () => unsubscribe()
        */
    }

    return {
        initAuth,
    }
}
