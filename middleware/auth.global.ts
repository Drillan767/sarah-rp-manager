export default defineNuxtRouteMiddleware((to, _from) => {
    const regex = /\/(oubli-mdp|connexion|inscription|nouveau-mdp)(\#.*)?/
    const user = useSupabaseUser()

    if (!regex.test(to.fullPath) && (!user.value)) return navigateTo('/connexion')

    if (regex.test(to.fullPath) && user.value) return navigateTo('/')
})