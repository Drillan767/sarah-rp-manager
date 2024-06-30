<script setup lang="ts">
import type { Database } from '~/types/supabase'
import type { CurrentUser } from '~/types/models'

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const currentUser = useState<CurrentUser | undefined>('current-user')

// Get redirect path from cookies
const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectPath = useCookie(`${cookieName}-redirect-path`).value

watch(user, async () => {
    if (user.value) {
        // Clear cookie
        useCookie(`${cookieName}-redirect-path`).value = null

        const { user_metadata: twitter } = user.value

        currentUser.value = {
            id: user.value.id,
            handle: twitter.user_name,
            username: twitter.name,
            avatar: twitter.picture,
        }

        const { count } = await supabase
            .from('users')
            .select('*', {
                count: 'exact',
                head: true,
            })
            .eq('username', twitter.user_name)

        if (count === 0) {
            await supabase
                .from('users')
                .insert({
                    username: twitter.user_name,
                    email: twitter.email,
                    session_id: user.value.id,
                    availability: {
                        weekends: false,
                        weekdays: false,
                        available: [],
                        unavailble: [],
                    },
                })
        }

        // Redirect to path
        return navigateTo(redirectPath || '/')
    }
}, { immediate: true })
</script>

<template>
    <div class="h-100">
        <VOverlay
            class="align-center justify-center"
        >
            <VProgressCircular
                color="primary"
                size="64"
                indeterminate
            />
        </VOverlay>
    </div>
</template>
