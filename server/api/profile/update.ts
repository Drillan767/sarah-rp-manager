import type { Database } from '@/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    if (!isMethod(event, 'POST')) {
        throw createError({
            statusCode: 404,
        })
    }

    const body = await readMultipartFormData(event)
    const supabase = serverSupabaseClient<Database>(event)

    if (!body) {
        throw createError({
            statusCode: 400,
        })
    }

    const payload: Record<string, string> = {}

    // file should be handled beforehand.
    // If email, update supabase auth

    for (const field of body) {
        payload[field.name!.toString()] = field.data.toString()
    }

    // Checks if user exists in database
    
    const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

    if (count && count > 0) {
        const sessId = payload.session_id
        delete(payload['session_id'])

        const { error } = await supabase
            .from('users')
            .update(payload)
            .eq('session_id', sessId)
    } else {
        const { session_id, email, username, description } = payload
        const { error } = await supabase
            .from('users')
            .insert({
                session_id,
                email,
                is_admin: false,
                availability: [],
                username,
                description,
                created_at: new Date().toDateString()
            })
        console.log(error)
    }

    return { body }

})