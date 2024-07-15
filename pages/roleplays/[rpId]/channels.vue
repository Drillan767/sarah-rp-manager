<script setup lang="ts">
import type { Database } from '@/types/supabase'
import type { Channel, CurrentUser } from '@/types/models'
import RPLayoutVue from '~/components/rp/RPLayout.vue.vue'

interface OnlineUser {
    presence_ref: string
    user: CurrentUser
    online_at: string
}

definePageMeta({
    layout: 'channels',
})

const supabase = useSupabaseClient<Database>()
const route = useRoute()
const currentUser = useState<CurrentUser | undefined>('current-user')

const { params: { rpId } } = route

const loadingChannels = ref(false)
const onlineUsers = ref<OnlineUser[]>([])
const channelsList = ref<Channel[]>([])

const channelsActivity = supabase.channel(`channel-${rpId.toString()}`)
    .on('presence', { event: 'sync' }, () => {
        const presences = Object.values(channelsActivity.presenceState())

        // TODO: Use array.flat() to avoid headaches.
        // console.log(presences.flat())

        presences.forEach((presence: any[]) => {
            const found = onlineUsers.value.some(u => u.presence_ref === presence[0].presence_ref)
            if (!found)
                onlineUsers.value.push(presence[0])
        })
    })
    /* .on('presence', { event: 'join' }, ({ newPresences }) => {
        const found = onlineUsers.value.some(u => u.presence_ref === newPresences[0].presence_ref)
        if (!found)
            onlineUsers.value.push(newPresences[0])
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        onlineUsers.value = onlineUsers.value.filter(user => leftPresences[0].presence_ref !== user.presence_ref)
    }) */
    .subscribe()

async function loadChannels() {
    loadingChannels.value = true

    try {
        const { data } = await supabase
            .from('channels')
            .select('*')
            .eq('roleplay_id', rpId.toString())

        if (data)
            channelsList.value = data
    }
    catch (e: any) {
        console.warn(e.message)
    }
    finally {
        loadingChannels.value = false
    }
}

async function getOnlineUsers() {
    await channelsActivity.track({
        user: currentUser.value,
        online_at: new Date().toISOString(),
    })
}

onMounted(() => {
    getOnlineUsers()
    loadChannels()
})

onBeforeUnmount(() => channelsActivity.untrack())
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
