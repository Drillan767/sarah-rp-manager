<script setup lang="ts">
import type { Channel, CurrentUser, Roleplay } from '@/types/models'
import type { Database } from '~/types/supabase'
import RPLayout from '~/components/rp/RPLayout.vue.vue'

definePageMeta({
    layout: 'channels',
})

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
const roleplay = ref<Roleplay>()
const publicChannels = ref<PublicChannel[]>([])
const privateChannels = ref<PrivateChannel[]>([])
const roleplayLoading = ref(false)
const channelsLoading = ref(false)

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

    if (data) {
        publicChannels.value = data.filter((d): d is PublicChannel => d.internal === true)
        privateChannels.value = data.filter((d): d is PrivateChannel => d.internal === false)
    }

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

    <NuxtPage />
</template>
