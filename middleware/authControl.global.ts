import type { Database } from '~/types/supabase'

export default defineNuxtRouteMiddleware(async (to) => {
    if (to.name && /roleplays-id-(characters|edit).*/.test(to.name.toString())) {
        const supabase = useSupabaseClient<Database>()
        const supabaseUser = useSupabaseUser()
        let rpFound: any = null

        if (!supabaseUser.value)
            return navigateTo(`/roleplays/${to.params.id}`)

        const userId = supabaseUser.value.id

        const { data: currentUser } = await supabase
            .from('users')
            .select('id')
            .eq('session_id', userId)
            .single()

        if (to.name.toString().includes('characters')) {
            const { data } = await supabase
                .from('roleplays')
                .select(`
                    id,
                    roles(
                        id,
                        characters(
                            status
                        )
                    )
                `)
                .or(`user_id.eq.${currentUser!.id}, and(user_id.eq.${currentUser!.id},status.eq.2)`, { foreignTable: 'roles.characters' })

            rpFound = data ?? null
        }

        if (to.name.toString().includes('edit')) {
            const { data } = await supabase
                .from('roleplays')
                .select('user_id')
                .eq('user_id', currentUser!.id)

            rpFound = data ?? null
        }

        if (!rpFound)
            return navigateTo(`/roleplays/${to.params.id}`)
    }

    if (to.name && to.name === '/my-roleplays') {
        const supabaseUser = useSupabaseUser()
        if (!supabaseUser.value)
            return navigateTo('/')
    }
})
