import { createUser, deleteUser, getUser, updateUser } from '@sarah-rp-manager/default-connector'

interface UserPayload {
    uid: string
    username: string
    handle: string
    email: string
    avatar: string
    role: 'USER' | 'ADMIN'
}

interface UpdateUserPayload {
    username: string
    handle: string
    email: string
    avatar: string
    description: string
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

            return data.user
        }
        catch (error) {
            console.error('Error checking/creating user:', error)
            throw error
        }
    }

    const getUserInfo = async (userId: string) => {
        const { data } = await getUser({ id: userId })
        return data.user
    }

    const updateUserInfo = async (userId: string, updates: UpdateUserPayload) => {
        try {
            await updateUser({
                id: userId,
                ...updates,
            })
        }
        catch (error) {
            console.error('Error updating user:', error)
            throw error
        }
    }

    const deleteUserAccount = async (userId: string) => {
        try {
            await deleteUser({ id: userId })
        }
        catch (error) {
            console.error('Error deleting user:', error)
            throw error
        }
    }

    return {
        createUserIfNotExists,
        getUserInfo,
        updateUserInfo,
        deleteUserAccount,
    }
}
