import type { Database } from '~/types/supabase'
import type { CurrentUser } from '~/types/models'

export default defineNuxtRouteMiddleware(async (to) => {
    if (!to.name)
        return

    const currentUser = useState<CurrentUser | undefined>('current-user')

    const protectedRoutes = [
        'roleplays-rpId-channels',
        'roleplays-rpId-edit',
        'roleplays-create',
        'my-roleplays',
        'profile',
    ]

    if (protectedRoutes.some(r => to.name?.toString().startsWith(r)) && !currentUser.value)
        return navigateTo('/')
})
