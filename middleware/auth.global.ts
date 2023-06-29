export default defineNuxtRouteMiddleware((to, _from) => {
    const authRoutes = ['/reinitialiser-mot-de-passe', '/connexion', '/inscription']
    const user = useSupabaseUser()

    if (!authRoutes.includes(to.fullPath) && (!user.value)) return navigateTo('/connexion')

    if (authRoutes.includes(to.fullPath) && user.value) return navigateTo('/')
})