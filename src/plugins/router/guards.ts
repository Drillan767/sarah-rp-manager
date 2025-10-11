import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { storeToRefs } from 'pinia'
import useUsersStore from '@/stores/auth'

export async function authGuard(
    to: RouteLocationNormalized,
    _: RouteLocationNormalized,
    next: NavigationGuardNext,
) {
    const authStore = useUsersStore()
    const { isAuthenticated, loading } = storeToRefs(authStore)

    // Wait for auth initialization to complete
    if (loading.value) {
        await authStore.initialize()
    }

    // Check if the route requires authentication
    const requiresAuth = to.path.startsWith('/profil')
        || to.path.startsWith('/mes-roleplays')
        || to.path.startsWith('/roleplays/')

    if (requiresAuth && !isAuthenticated.value) {
        // Redirect to home page if not authenticated
        next({
            name: 'home',
            query: {
                error: 'auth-required',
            },
        })
    }
    else {
        // Allow navigation
        next()
    }
}
