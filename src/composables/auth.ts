import type { User } from 'firebase/auth'
import { onAuthStateChanged, signInWithPopup, TwitterAuthProvider } from 'firebase/auth'
import { storeToRefs } from 'pinia'
import useUsersStore from '@/stores/users'
import useFirebase from './firebase'
import useUser from './user'

interface TwitterUser extends User {
    reloadUserInfo?: {
        screenName: string
    }
}

export default function useAuth() {
    const { auth } = useFirebase()
    const { user: storeUser } = storeToRefs(useUsersStore())
    const { createUserIfNotExists } = useUser()

    const signIn = async () => {
        try {
            const provider = new TwitterAuthProvider()
            await signInWithPopup(auth, provider)
        }
        catch (error) {
            console.error('twitter sign in error', error)
        }
    }

    const signOut = async () => {
        try {
            await auth.signOut()
        }
        catch (error) {
            console.error('Error signing out:', error)
        }
    }

    const initAuth = () => {
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
    }

    return {
        signIn,
        signOut,
        initAuth,
    }
}
