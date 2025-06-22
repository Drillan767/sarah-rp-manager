<script setup lang="ts">
import type { GetRoleplayData, ListChannelsForRoleplayData, ListUsersForRoleplayData } from '@sarah-rp-manager/default-connector'
import { getRoleplay, listChannelsForRoleplay, listUsersForRoleplay } from '@sarah-rp-manager/default-connector'
import { useHead } from '@vueuse/head'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type Roleplay = NonNullable<GetRoleplayData['roleplay']>
type Channels = NonNullable<ListChannelsForRoleplayData['channels']>
type Participations = NonNullable<ListUsersForRoleplayData['participations']>

interface UserList {
    id: string
    username: string
    handle: string
    avatar: string
    participations: Participations
}

const route = useRoute()
const router = useRouter()
const rpId = route.params.id.toString()

const loading = ref(false)
const roleplay = ref<Roleplay>()
const channels = ref<Channels>([])
const participations = ref<Participations>([])

const users = computed(() => {
    return participations.value.reduce<UserList[]>((acc, participation) => {
        const user = acc.find(user => user.id === participation.user.id)
        if (user) {
            user.participations.push(participation)
        }
        else {
            acc.push({ ...participation.user, participations: [participation] })
        }
        return acc
    }, [])
})

async function loadRoleplay() {
    const { data } = await getRoleplay({ id: rpId })
    if (!data.roleplay) {
        router.push({ name: 'roleplay-details', params: { id: rpId } })
        return
    }

    roleplay.value = data.roleplay
}

async function loadParticipations() {
    const { data } = await listUsersForRoleplay({ roleplayId: rpId })
    participations.value = data.participations

    if (data.participations.length === 0) {
        router.push({ name: 'roleplay-details', params: { id: rpId } })
    }
}

async function loadChannels() {
    const { data } = await listChannelsForRoleplay({ roleplayId: rpId })
    channels.value = data.channels
}

useHead({
    title: () => roleplay.value?.title ?? 'Roleplay',
})

onMounted(async () => {
    loading.value = true
    await Promise.all([
        loadRoleplay(),
        loadParticipations(),
        loadChannels(),
    ])
    loading.value = false
})

watch(channels, (value) => {
    if (value.length) {
        const mainChannel = value.find(channel => channel.name === 'Canal principal')
        if (mainChannel) {
            router.push({ name: 'roleplay-channels-detail', params: { id: rpId, channelId: mainChannel.id } })
        }
    }
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

            <VListItem
                v-for="user in users"
                :key="user.id"
                :title="user.username"
            >
                <template #prepend>
                    <VAvatar
                        :image="user.avatar"
                    />
                </template>
            </VListItem>
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
    <RouterView />
</template>
