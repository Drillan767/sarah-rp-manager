import { defineStore } from 'pinia'
import type { Database } from '@/types/supabase'
import type { Roleplay, RoleplayDetail } from '@/types'

export const useRoleplayStore = defineStore('roleplay', () => {
    const supabase = useSupabaseClient<Database>()

    const roleplay = ref<RoleplayDetail>({} as RoleplayDetail)
    const rpList = ref<Roleplay[]>([])

    async function loadSingleRP(uuid: string) {
        const { data, error } = await supabase
            .from('roleplays')
            .select(`*,
                roles(id, name, max_users, roleplay_id),
                channels(name, private)`)
            .eq('id', uuid)
            .single()

        if (error) {
            throw createError({
                statusCode: 404,
                message: 'Roleplay introuvable',
                fatal: true,
            })
        }

        roleplay.value = data
    }

    async function loadAllRP() {
        const rps: Roleplay[] = []
        const { data } = await supabase
            .from('roleplays')
            .select('id, title, illustration, start_date, description, roles(roleplay_id, max_users, roles_users(id))')

        if (data) {
            data.forEach((rp) => {
                const roleplay: Roleplay = {
                    id: rp.id,
                    description: rp.description,
                    illustration: rp.illustration,
                    start_date: rp.start_date ?? '',
                    title: rp.title,
                    totalUsers: 0,
                    nbCurrentUsers: 0,
                }

                rp.roles.forEach((role) => {
                    if (role.max_users)
                        roleplay.totalUsers += role.max_users
                    roleplay.nbCurrentUsers += role.roles_users.length
                })

                rps.push(roleplay)
            })
        }

        rpList.value = rps
    }

    async function updateRP(formData: FormData) {
        await useFetch('/api/rp/update', {
            method: 'POST',
            body: formData,
        })
    }

    return {
        roleplay,
        rpList,
        loadSingleRP,
        loadAllRP,
        updateRP,
    }
})
