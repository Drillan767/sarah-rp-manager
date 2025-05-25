import { createUser, getUser } from '@sarah-rp-manager/default-connector'

interface UserPayload {
    uid: string
    username: string
    handle: string
    email: string
    avatar: string
    role: 'USER' | 'ADMIN'
}

export default function useUser() {
    const createUserIfNotExists = async (firebaseUser: UserPayload) => {
        try {
            // First check if user exists
            const { data } = await getUser({ id: firebaseUser.uid })

            if (!data.user) {
                // User doesn't exist, create new user
                await createUser({
                    id: firebaseUser.uid,
                    username: firebaseUser.username,
                    handle: firebaseUser.handle,
                    email: firebaseUser.email,
                    avatar: firebaseUser.avatar,
                    isAdmin: false,
                    description: '',
                })
            }

            // return existingUser.user
        }
        catch (error) {
            console.error('Error checking/creating user:', error)
            throw error
        }
    }

    return {
        createUserIfNotExists,
    }
}
