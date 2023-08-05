import type { Database } from '@/types/supabase'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const body = await readMultipartFormData(event)
    const supabase = serverSupabaseClient<Database>(event)

    if (!body) {
        throw createError({
            statusCode: 400,
        })
    }

    const payload: Record<string, string> = {}

    for (const field of body) {
        const fieldName = field.name!.toString()
        if (fieldName !== 'media') {
            if (fieldName === 'availability')
                payload.availability = JSON.parse(field.data.toString())
            else
                payload[fieldName] = field.data.toString()
        }
    }

    const { password, ...metaFields } = payload
    await supabase.auth.signUp({
        email: payload.email,
        password,
        options: {
            data: metaFields,
        },
    })

    return {
        payload,
    }
})
