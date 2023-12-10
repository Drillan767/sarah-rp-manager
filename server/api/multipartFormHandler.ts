import type { EventHandlerRequest, H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase'

export default async function multipartFormHandler(event: H3Event<EventHandlerRequest>) {
    const body = await readMultipartFormData(event)

    if (!body)
        throw createError({ statusCode: 400 })

    const supabase = await serverSupabaseClient<Database>(event)

    const payload: Record<string, string> = {}

    for (const field of body) {
        const fieldName = field.name!.toString()

        if (fieldName !== 'illustration')
            payload[fieldName] = field.data.toString()
    }

    return {
        payload,
        supabase,
        body,
    }
}
