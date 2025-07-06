<script setup lang="ts">
import type { GetRoleplayData, ListChannelsForRoleplayData, ListUsersForRoleplayData } from '@sarah-rp-manager/default-connector'
import { getRoleplay, listChannelsForRoleplay, listUsersForRoleplay } from '@sarah-rp-manager/default-connector'
import { useHead } from '@vueuse/head'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useChat from '@/composables/chat'

type Roleplay = NonNullable<GetRoleplayData['roleplay']>
type Channels = NonNullable<ListChannelsForRoleplayData['channels']>
type Participations = NonNullable<ListUsersForRoleplayData['participations']>

interface UserList {
    id: string
    username: string
    handle: string
    avatar: string
    participations: Participations
    online: boolean
}

const route = useRoute()
const router = useRouter()
const rpId = route.params.id.toString()
const {
    messages,
    typingUsers,
    getOnlineUsers,
    setPresence,
    onlineUsers,
    subscribeToMessages,
    loadMessageHistory,
} = useChat()

const loading = ref(false)
const roleplay = ref<Roleplay>()
const channels = ref<Channels>([])
const participations = ref<Participations>([])

const users = computed(() => {
    return participations.value.reduce<UserList[]>((acc, participation) => {
        const onlineUser = onlineUsers.value.find(user => user.userId === participation.user.id)
        if (acc.find(user => user.id === participation.user.id)) {
            acc.find(user => user.id === participation.user.id)!.participations.push(participation)
        }
        else {
            acc.push({
                ...participation.user,
                participations: [participation],
                online: onlineUser?.isOnline ?? false,
            })
        }
        return acc
    }, [])
})

// Filter messages by current channel
const currentChannelMessages = computed(() => {
    const currentChannelId = route.params.channelId as string
    if (!currentChannelId)
        return []

    return messages.value.filter(message => message.channelId === currentChannelId)
})

// Filter typing users by current channel
const currentChannelTypingUsers = computed(() => {
    const currentChannelId = route.params.channelId as string
    if (!currentChannelId)
        return []

    return typingUsers.value.filter(user => user.channelId === currentChannelId)
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

async function loadAllMessages() {
    // Load message history for all channels
    for (const channel of channels.value) {
        await loadMessageHistory(rpId, channel.id)
    }
}

function listOnlineUsers() {
    const unsubscribe = getOnlineUsers(rpId)
    return () => unsubscribe()
}

function subscribeToAllChannels() {
    // Subscribe to messages for all channels
    const unsubscribers: (() => void)[] = []

    for (const channel of channels.value) {
        const unsubscribe = subscribeToMessages(rpId, channel.id)
        if (unsubscribe) {
            unsubscribers.push(unsubscribe)
        }
    }

    return () => {
        unsubscribers.forEach(unsubscribe => unsubscribe())
    }
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
        listOnlineUsers(),
        setPresence(rpId, true),
    ])

    // Load messages and subscribe to all channels after channels are loaded
    await loadAllMessages()
    const unsubscribeAll = subscribeToAllChannels()

    loading.value = false

    // Store unsubscribe function for cleanup
    onBeforeUnmount(() => {
        if (unsubscribeAll) {
            unsubscribeAll()
        }
    })
})

onBeforeUnmount(() => setPresence(rpId, false))

watch(channels, async (value) => {
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
                    <VBadge
                        :color="user.online ? 'success' : 'error'"
                        location="bottom right"
                        dot
                    >
                        <VAvatar
                            :image="user.avatar"
                        />
                    </VBadge>
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
    <RouterView
        :messages="currentChannelMessages"
        :typing-users="currentChannelTypingUsers"
        :channels="channels"
    />
</template>
