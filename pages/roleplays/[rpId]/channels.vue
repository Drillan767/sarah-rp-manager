<script setup lang="ts">
import type { Channel, CurrentUser, Roleplay } from '@/types/models'
import type { Database } from '~/types/supabase'
import RPLayout from '~/components/rp/RPLayout.vue.vue'

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const currentUser = useState<CurrentUser | undefined>()
const route = useRoute()

const roleplayId = ref('')
const roleplay = ref<Roleplay>()
const channels = ref<Channel[]>([])
const roleplayLoading = ref(false)
const channelsLoading = ref(false)

definePageMeta({
    layout: 'channels',
})

useHead({
    title: () => roleplay.value?.title ?? '',
})

async function loadRoleplay() {
    roleplayLoading.value = true
    const { data } = await supabase
        .from('roleplays')
        .select('*, roles(*)')
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
        .select('*')
        .eq('roleplay_id', roleplayId.value)

    if (data)
        channels.value = data

    channelsLoading.value = false
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

watch(() => route.params, ({ rpId }) => {
    roleplayId.value = rpId.toString()
    loadRoleplay()
    loadChannels()
}, { immediate: true })
</script>

<template>
    <RPLayout
        :roleplay="roleplay"
        :loading="roleplayLoading"
    >
        <template #channels>
            <VSkeletonLoader
                :loading="channelsLoading"
                type="list-item-avatar-two-line@2"
            >
                <VList class="w-100">
                    <VListSubheader
                        title="Canaux de discussion"
                    />
                    <VListItem
                        v-for="(channel, i) in channels"
                        :key="i"
                        :prepend-icon="channel.internal ? 'mdi-chat-outline' : 'mdi-chat'"
                        :title="channel.name"
                        :to="`/roleplays/${roleplayId}/channels/${channel.id}`"
                    />
                </VList>
            </VSkeletonLoader>
        </template>
        <template #characters>
            <p>Characters</p>
        </template>
    </RPLayout>

    <NuxtPage />
</template>
