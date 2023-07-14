export default defineNuxtRouteMiddleware((to, _from) => {
    const authRoutes = [
        '/inscription',
        '/connexion',
        '/oubli-mdp',
        '/nouveau-mdp',
    ]
    const user = useSupabaseUser()

    if (!authRoutes.includes(to.fullPath) && (!user.value)) return navigateTo('/connexion')

    if (authRoutes.includes(to.fullPath) && user.value) return navigateTo('/')
})