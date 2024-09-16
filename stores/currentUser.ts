import type { CurrentUser } from '~/types/models'

export const useCurrentUser = defineStore('current-user', () => {
    const currentUser = ref<CurrentUser>()

    return {
        currentUser,
    }
}, {
    persist: true,
})
