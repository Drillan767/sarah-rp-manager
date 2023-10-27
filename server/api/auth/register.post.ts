import type { Database } from '~/types/supabase';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async(event) => {
    const body = await readBody(event)

    const supabase = await serverSupabaseClient<Database>(event)

    const { data: registeredUser } = await supabase
        .auth
        .signUp({
            email: body.email,
            password: body.password,
        })

    if (!registeredUser) {
        throw createError({
            statusCode: 400,
            message: 'Issue when registering user',
        })
    }

    const { data: insertedUser } = await supabase
        .from('users')
        .insert({
            username: body.username,
            email: body.email,
            session_id: registeredUser.user?.id,
            availability: { weekdays: false, weekends: false, available: [], unavailable: [] },
            superadmin: false,
        })
        .select('id, session_id, username, superadmin')

    if (!registeredUser) {
        throw createError({
            statusCode: 400,
            message: 'Issue when storing user',
        })
    }

    return insertedUser


    /*const { data: emailCount } = await supabase.from('users').select('id').eq('email', registerForm.value.email)


        const { data: registeredUser } = await supabase
            .auth
            .signUp({
                email: registerForm.value.email,
                password: registerForm.value.password,
            })

        if (registeredUser) {
            await supabase
                .from('users')
                .insert({
                    username: registerForm.value.username,
                    email: registerForm.value.username,
                    session_id: registeredUser.user?.id,
                    availability: { weekdays: false, weekends: false, available: [], unavailable: [] },
                    superadmin: false,
                })

            currentUser.value = {

            }

            const { data: authData  } = await supabase
                .auth
                .signInWithPassword({
                    email: loginForm.value.email,
                    password: loginForm.value.password,
                })

            if (userData) {
                currentUser.value = userData

                showSuccess(t('login.success'))
                emit('login')
            }
        }*/

})
