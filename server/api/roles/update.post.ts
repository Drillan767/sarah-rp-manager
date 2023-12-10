import type { Database } from '~/types/supabase'
import type { CreatedRole, Role } from '~/types/models'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const body = await readBody<(CreatedRole | Role)[]>(event)

    const supabase = await serverSupabaseClient<Database>(event)

    const rolesUpdateList: Role[] = []
    const rolesCreateList: CreatedRole[] = []

    body.forEach((role) => {
        if ('id' in role)
            rolesUpdateList.push(role)
        else
            rolesCreateList.push(role)
    })

    // Creating new roles.
    await supabase
        .from('roles')
        .insert(rolesCreateList)

    // Updating existing ones.
    for (const r of rolesUpdateList) {
        const { id, ...fields } = r
        await supabase
            .from('roles')
            .update(fields)
            .eq('id', id)
    }

    return body
})
