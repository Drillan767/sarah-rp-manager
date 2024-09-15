<script setup lang="ts">
import useRealtimeMessages from '~/composables/realtimeMessages'
import type { Database, Tables } from '~/types/supabase'

definePageMeta({
    layout: 'channels',
})

const route = useRoute()
const supabase = useSupabaseClient<Database>()
const supabaseUser = useSupabaseUser()
const { currentUser } = storeToRefs(useCurrentUser())

const {
    loadAll,
    onlineUsers,
    publicChannels,
    privateChannels,
    messages,
    disconnect,
} = useRealtimeMessages(route.params.rpId.toString())

const roleplay = ref<Tables<'roleplays'>>()
const roleplayLoading = ref(false)

useHead({
    title: () => roleplay.value?.title ?? '',
})

async function loadRoleplay() {
    roleplayLoading.value = true
    const { data } = await supabase
        .from('roleplays')
        .select('*, roles(*)') // load EVERYTHING
        .eq('id', route.params.rpId.toString())
        .single()

    if (data)
        roleplay.value = data

    roleplayLoading.value = false

    if (supabaseUser.value) {
        const { user_metadata: twitter } = supabaseUser.value
        currentUser.value = {
            id: supabaseUser.value.id,
            handle: twitter.user_name,
            username: twitter.name,
            avatar: twitter.picture,
        }
    }
}

watch(() => route.params.rpId, async (newRpId, oldRpId) => {
    // Clean up existing subscriptions
    if (oldRpId)
        disconnect()

    // Set up new subscriptions
    await loadRoleplay()
    await loadAll()
}, { immediate: true })
</script>

<template>
    <pre>
        <p>Current user</p>
        <code>
            {{ currentUser }}
        </code>
        <p>public channels</p>
        <code>
            {{ publicChannels }}
        </code>
        <p>private channels</p>
        <code>
            {{ privateChannels }}
        </code>
        <p>online users</p>
        <code>
            {{ onlineUsers }}
        </code>
        <p>messages</p>
        <code>
            {{ messages }}
        </code>
    </pre>
    <NuxtPage
        :roleplay
        :messages
    />
</template>
