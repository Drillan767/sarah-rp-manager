import type { Database } from '@/types/supabase'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

const supabaseUrl = process.env.SUPABASE_URL

export default defineEventHandler(async (event) => {
    if (!isMethod(event, 'POST')) {
        throw createError({
            statusCode: 404,
        })
    }

    const body = await readMultipartFormData(event)
    const supabase = serverSupabaseClient<Database>(event)
    const session = await serverSupabaseUser(event)

    if (!body) {
        throw createError({
            statusCode: 400,
        })
    }

    const payload: Record<string, string> = {}

    for (const field of body) {
        const fieldName = field.name!.toString()
        if (fieldName !== 'media') {
            if (fieldName === 'availability') {
                payload['availability'] = JSON.parse(field.data.toString())
            } else {
                payload[fieldName] = field.data.toString()
            }
        }
    }

    const mediaData = body.find((field) => field.name === 'media')

    if (mediaData) {
        const avatarPath = `${payload.session_id}/profile/${mediaData.filename}`

        // Cleanup user avatar directory
        const { error: deleteError } = await supabase
            .storage
            .from('avatars')
            .remove([`${payload.session_id}/profile`])

        console.log({ deleteError })

        // Upload new avatar
        const { error: uploadError } = await supabase
            .storage
            .from('avatars')
            .upload(avatarPath, mediaData.data)

        payload.image_url = `${supabaseUrl}/storage/v1/object/public/avatars/${avatarPath}`
    }

    // Checks if user exists in database
    const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', session!.id)

    if (count && count > 0) {
        const {session_id, ...fields } = payload

        await supabase
            .from('users')
            .update(fields)
            .eq('session_id', session_id)

    } else {
        const { session_id, email, username, description, availability } = payload
        const { error: userCreationError } = await supabase
            .from('users')
            .insert({
                session_id,
                email,
                availability,
                username,
                description,
                created_at: new Date().toDateString()
            })
    }

    return { payload }

})