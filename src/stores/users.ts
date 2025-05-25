import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import useAuth from '@/composables/auth'

interface User {
    id: string
    handle: string
    username: string
    avatar: string
}

export const useUsersStore = defineStore('users', () => {
    const { signIn, signOut } = useAuth()
    const user = ref<User>()

    const isAuthenticated = computed(() => !!user.value)

    return {
        user,
        isAuthenticated,
        signIn,
        signOut,
    }
}, {
    persist: true,
})
