export default defineNuxtRouteMiddleware((to, _from) => {
    const regexWithProfile = /\/(oubli-mdp|connexion|profil|nouveau-mdp)(\#.*)?/
    const regexWithoutProfile = /\/(oubli-mdp|connexion|nouveau-mdp)(\#.*)?/
    const user = useSupabaseUser()

    if (!regexWithProfile.test(to.fullPath) && (!user.value))
        return navigateTo('/connexion')

    if (regexWithoutProfile.test(to.fullPath) && user.value)
        return navigateTo('/')
})
