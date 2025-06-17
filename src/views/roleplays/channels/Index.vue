<script setup lang="ts">
import type { GetRoleplayData, ListChannelsForRoleplayData, ListParticipationsForRoleplayData } from '@sarah-rp-manager/default-connector'
import { getRoleplay, listChannelsForRoleplay, listParticipationsForRoleplay } from '@sarah-rp-manager/default-connector'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type Roleplay = NonNullable<GetRoleplayData['roleplay']>
type Channels = NonNullable<ListChannelsForRoleplayData['channels']>
type Participations = NonNullable<ListParticipationsForRoleplayData['participations']>

const route = useRoute()
const router = useRouter()
const rpId = route.params.id.toString()

const loading = ref(false)
const roleplay = ref<Roleplay>()
const channels = ref<Channels>()
const participations = ref<Participations>()

async function loadRoleplay() {
    const { data } = await getRoleplay({ id: rpId })
    if (!data.roleplay) {
        router.push({ name: 'roleplay-details', params: { id: rpId } })
        return
    }

    roleplay.value = data.roleplay
}

async function loadParticipations() {
    const { data } = await listParticipationsForRoleplay({ roleplayId: rpId })
    participations.value = data.participations

    if (data.participations.length === 0) {
        router.push({ name: 'roleplay-details', params: { id: rpId } })
    }
}

async function loadChannels() {
    const { data } = await listChannelsForRoleplay({ roleplayId: rpId })
    channels.value = data.channels
}

onMounted(async () => {
    loading.value = true
    await Promise.all([
        loadRoleplay(),
        loadParticipations(),
        loadChannels(),
    ])
    loading.value = false
})
</script>

<template>
    <VAppBar
        color="primary"
    >
        <template #prepend>
            <VBtn
                icon="mdi-arrow-left"
                @click="router.push({ name: 'roleplay-details', params: { id: rpId } })"
            />
        </template>
        <template #title>
            <h2>
                {{ roleplay?.title }}
            </h2>
        </template>
    </VAppBar>
    <VNavigationDrawer
        permanent
    >
        <VList>
            <VListSubheader>
                <VIcon
                    icon="mdi-account-group"
                    class="mr-2"
                />
                Membres
            </VListSubheader>
        </VList>
        <VDivider />
        <VList
            nav
        >
            <VListSubheader>
                <VIcon
                    icon="mdi-comment-multiple-outline"
                    class="mr-2"
                />
                Canaux
            </VListSubheader>
            <VListItem
                v-for="channel in channels"
                :key="channel.id"
                :title="channel.name"
                :to="{ name: 'roleplay-channels-detail', params: { id: rpId, channelId: channel.id } }"
                prepend-icon="mdi-comment-outline"
                nav
            />
        </VList>
    </VNavigationDrawer>
</template>
