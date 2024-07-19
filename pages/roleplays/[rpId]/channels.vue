<script setup lang="ts">
import type { CurrentUser } from '@/types/models'
import RPLayoutVue from '~/components/rp/RPLayout.vue.vue'

const user = useSupabaseUser()
const currentUser = useState<CurrentUser | undefined>()

definePageMeta({
    layout: 'channels',
})

watch(user, (value) => {
    if (value) {
        const { user_metadata: twitter } = value

        currentUser.value = {
            id: value.id,
            handle: twitter.user_name,
            username: twitter.name,
            avatar: twitter.picture,
        }
    }
}, { immediate: true })
</script>

<template>
    <RPLayoutVue>
        <template #channels>
            <p>Channels</p>
        </template>
        <template #characters>
            <p>Characters</p>
        </template>
    </RPLayoutVue>

    <NuxtPage />
</template>
