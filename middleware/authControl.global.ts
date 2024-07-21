export default defineNuxtRouteMiddleware(async (to) => {
    if (!to.name)
        return

    const user = useSupabaseUser()

    const protectedRoutes = [
        'roleplays-rpId-channels',
        'roleplays-rpId-edit',
        'roleplays-create',
        'my-roleplays',
        'profile',
    ]

    if (protectedRoutes.some(r => to.name?.toString().startsWith(r)) && !user.value)
        return navigateTo('/')
})
