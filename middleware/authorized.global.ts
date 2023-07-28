import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/users'

export default defineNuxtRouteMiddleware((to, _from) => {
    const userStore = useUserStore()
    const { user } = storeToRefs(userStore)

    if (to.fullPath.endsWith('/modifier') || to.fullPath.endsWith('/nouveau')) {
        if (!user.value.is_sarah) {
            throw createError({
                statusCode: 404,
                message: 'Page non trouvée',
                fatal: true,
            })
        }
    }
})
