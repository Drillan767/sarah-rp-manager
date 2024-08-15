<script setup lang="ts">
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js'
import type {
    RealtimeChannel,
    RealtimePostgresInsertPayload,
    RealtimePostgresUpdatePayload,
} from '@supabase/supabase-js'
import type { CurrentUser } from '@/types/models'
import type { Database, Tables } from '~/types/supabase'
import RPLayout from '~/components/rp/access/RPLayout.vue.vue'
import channels from '~/layouts/channels.vue'

definePageMeta({
    layout: 'channels',
})

type Channel = Tables<'channels'> & {
    channels_users: Tables<'channels_users'>[]
}

type PublicChannel = Channel & {
    internal: true
}

type PrivateChannel = Channel & {
    internal: false
}

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const currentUser = useState<CurrentUser | undefined>()
const route = useRoute()

const roleplayId = ref('')
const roleplay = ref<Tables<'roleplays'>>()
const publicChannels = ref<PublicChannel[]>([])
const privateChannels = ref<PrivateChannel[]>([])
const messages = ref<Tables<'messages'>[]>([])
const channelsId = ref<string[]>([])
const roleplayLoading = ref(false)
const channelsLoading = ref(false)

useHead({
    title: () => roleplay.value?.title ?? '',
})

async function loadRoleplay() {
    roleplayLoading.value = true
    const { data } = await supabase
        .from('roleplays')
        .select('*, roles(*)') // load EVERYTHING
        .eq('id', roleplayId.value)
        .single()

    if (data)
        roleplay.value = data

    roleplayLoading.value = false
}

async function loadChannels() {
// Initial fetch for the channels.
    channelsLoading.value = true
    const { data } = await supabase
        .from('channels')
        .select('*, channels_users(*)')
        .eq('roleplay_id', roleplayId.value)

    if (data) {
        channelsId.value = data.map(d => d.id)
        publicChannels.value = data.filter((d): d is PublicChannel => d.internal === true)
        privateChannels.value = data.filter((d): d is PrivateChannel => {
            const authorizedUsers = d.channels_users.map(cu => cu.user_id)
            return d.internal === false && authorizedUsers.includes(currentUser.value?.id ?? '')
        })
    }

    channelsLoading.value = false
}

async function loadMessages() {
    const { data } = await supabase
        .from('messages')
        .select('*')
        .in('channel_id', channelsId.value)

    if (data)
        messages.value = data
}

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

watch(() => route.params, async ({ rpId }) => {
    roleplayId.value = rpId.toString()
    loadRoleplay()
    await loadChannels()
    await loadMessages()
}, { immediate: true })
</script>

<template>
    <RPLayout
        v-if="roleplay"
        v-model:public-channels="publicChannels"
        v-model:private-channels="privateChannels"
        :roleplay="roleplay"
        :loading="roleplayLoading"
    >
        <template #characters>
            <p>Characters</p>
        </template>
    </RPLayout>

    <NuxtPage
        :roleplay
        :messages
    />
</template>
