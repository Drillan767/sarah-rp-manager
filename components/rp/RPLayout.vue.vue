<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
import type { RealtimeChannel } from '@supabase/supabase-js'
import {
    REALTIME_LISTEN_TYPES,
    REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
    REALTIME_PRESENCE_LISTEN_EVENTS,
    REALTIME_SUBSCRIBE_STATES,
} from '@supabase/supabase-js'
import type { Channel, Character, CurrentUser, Roleplay } from '@/types/models'
import type { Database } from '~/types/supabase'

interface OnlineUser {
    presence_ref: string
    user: CurrentUser
    online_at: string
}

const route = useRoute()
const supabase = useSupabaseClient<Database>()
const { mdAndUp } = useDisplay()
const currentUser = useState<CurrentUser | undefined>('current-user')

const { params: { rpId } } = route

const presence = ref<RealtimeChannel>(supabase.channel(`presence-${rpId}`))
const dbRealTime = ref<RealtimeChannel>(supabase.channel(`db-${rpId}`))
const rpLoading = ref(false)
const channelsLoading = ref(false)
const charactersLoading = ref(false)
const channelsDrawer = ref(true)
const charactersDrawer = ref(true)
const showInfos = ref(false)
const onlineUsers = ref<OnlineUser[]>([])
const roleplay = ref<Roleplay>()
const channels = ref<Channel[]>([])
const characters = ref<Omit<Character, 'user'>[]>([])

useHead({
    title: () => roleplay.value?.title ?? '',
})

async function loadRoleplay() {
    rpLoading.value = true
    const { data } = await supabase
        .from('roleplays')
        .select('*, roles(*)')
        .eq('id', rpId.toString())
        .single()

    if (data)
        roleplay.value = data

    rpLoading.value = false
}

async function handleChannelInsert(payload: { new: Channel }) {
    if (payload.new.roleplay_id === rpId.toString()) {
        const exists = channels.value.find(c => c.id === payload.new.id)
        if (exists)
            return
        channels.value.push(payload.new)
    }
}

async function handleChannelUpdate(payload: { new: Channel }) {
    if (payload.new.roleplay_id === rpId.toString()) {
        const index = channels.value.findIndex(c => c.id === payload.new.id)
        channels.value[index] = payload.new
    }
}

async function handleChannelDeletion(payload: { old: { id: string } }) {
    channels.value = channels.value.filter(c => c.id !== payload.old.id)
}

async function channelsActivity() {
    // Initial fetch for the channels.
    channelsLoading.value = true
    const { data } = await supabase
        .from('channels')
        .select('*')
        .eq('roleplay_id', rpId.toString())

    if (data)
        channels.value = data

    channelsLoading.value = false

    // Setting up event listeners
    dbRealTime.value
        .on('postgres_changes', {
            event: 'insert',
            table: 'channels',
        }, handleChannelInsert)
        .on('postgres_changes', {
            event: 'update',
            table: 'channels',
        }, handleChannelUpdate)
        .on('postgres_changes', {
            event: 'delete',
            table: 'channels',
        }, handleChannelDeletion)
        .subscribe()
}

async function loadUserCharacters() {
    if (!currentUser.value)
        return

    charactersLoading.value = true

    const { data } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', currentUser.value?.id)

    if (data)
        characters.value = data

    await presence.value.track({
        user: currentUser.value,
        online_at: new Date().toISOString(),
        characters: characters.value,
    })
}

async function setupOnlineUsers() {
    presence.value
        .on('presence', { event: 'sync' }, () => {
            const presences = Object.values(presence.value.presenceState())
            console.log('sync', presences)

            // TODO: Use array.flat() to avoid headaches.
            // console.log(presences.flat())

            presences.forEach((presence: any[]) => {
                const found = onlineUsers.value.some(u => u.presence_ref === presence[0].presence_ref)
                if (!found)
                    onlineUsers.value.push(presence[0])
            })
        })
        .on('presence', { event: 'join' }, ({ newPresences }) => {
            const found = onlineUsers.value.some(u => u.presence_ref === newPresences[0].presence_ref)
            if (!found)
                onlineUsers.value.push(newPresences[0])
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
            onlineUsers.value = onlineUsers.value.filter(user => leftPresences[0].presence_ref !== user.presence_ref)
        })
        .subscribe()
    /* const channelsActivity = supabase.channel(`presence-${rpId.toString()}`)
        .on('presence', { event: 'sync' }, () => {
            const presences = Object.values(channelsActivity.presenceState())
            console.log(presences)

            // TODO: Use array.flat() to avoid headaches.
            // console.log(presences.flat())

            presences.forEach((presence: any[]) => {
                const found = onlineUsers.value.some(u => u.presence_ref === presence[0].presence_ref)
                if (!found)
                    onlineUsers.value.push(presence[0])
            })
        })
        .on('presence', { event: 'join' }, ({ newPresences }) => {
            const found = onlineUsers.value.some(u => u.presence_ref === newPresences[0].presence_ref)
            if (!found)
                onlineUsers.value.push(newPresences[0])
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
            onlineUsers.value = onlineUsers.value.filter(user => leftPresences[0].presence_ref !== user.presence_ref)
        })
        .subscribe() */
    /* presence.value = supabase
        .channel(`presence-${rpId.toString()}`)
        .on('presence', {
            event: 'sync',
        }, () => {
            const newState = presence.value?.presenceState()
            console.log('sync', newState)
        })
        .on('presence', {
            event: 'join',
        }, (event) => {
            console.log('join', event)
        })
        .on('presence', {
            event: 'leave',
        }, (event) => {
            console.log('leave', event)
        })
        .subscribe()

    await loadUserCharacters()

    console.log(presence.value.presenceState()) */
}

/* LOADS LOGGED IN USERS
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
    .on('presence', { event: 'join' }, ({ newPresences }) => {
        const found = onlineUsers.value.some(u => u.presence_ref === newPresences[0].presence_ref)
        if (!found)
            onlineUsers.value.push(newPresences[0])
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        onlineUsers.value = onlineUsers.value.filter(user => leftPresences[0].presence_ref !== user.presence_ref)
    })
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
} */

onMounted(async () => {
    await setupOnlineUsers()
    await loadUserCharacters()
    loadRoleplay()
    channelsActivity()
    // loadUserCharacters()
})

onBeforeUnmount(() => {
    dbRealTime.value.unsubscribe()
    presence.value.unsubscribe()
    supabase.removeAllChannels()
})
</script>

<template>
    <VAppBar
        title="Le Jardin de Sarah"
        class="px-6"
    >
        <template #prepend>
            <RouterLink to="/">
                <VAvatar :tile="true" image="/sarah.jpg" />
            </RouterLink>
        </template>
        <template #extension>
            <VContainer fluid>
                <VRow>
                    <VDivider />
                </VRow>
                <VRow
                    :justify="mdAndUp ? 'center' : 'space-between'"
                >
                    <VCol
                        v-if="!mdAndUp"
                        cols="1"
                    >
                        <VBtn
                            icon="mdi-forum"
                            @click.stop="channelsDrawer = !channelsDrawer"
                        />
                    </VCol>
                    <VCol
                        :cols="mdAndUp ? 3 : undefined"
                        class="d-flex align-center justify-center"
                    >
                        <h1 class="text-h6">
                            {{ roleplay?.title }}
                        </h1>
                    </VCol>
                    <VCol
                        v-if="!mdAndUp"
                        cols="1"
                        class="text-right"
                    >
                        <VBtn
                            icon="mdi-account-group"
                            @click.stop="charactersDrawer = !charactersDrawer"
                        />
                    </VCol>
                </VRow>
            </VContainer>
        </template>
    </VAppBar>

    <VNavigationDrawer
        v-model="channelsDrawer"
        :permanent="mdAndUp"
    >
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
                    :to="`/roleplays/${rpId}/channels/${channel.id}`"
                />
            </VList>
        </VSkeletonLoader>

        <template #append>
            <div class="pa-2">
                <VBtn
                    prepend-icon="mdi-chat-plus"
                    class="pa-2"
                    variant="outlined"
                    color="primary"
                    block
                >
                    Nouveau canal
                </VBtn>
            </div>
        </template>
    </VNavigationDrawer>

    <VNavigationDrawer
        v-model="charactersDrawer"
        :permanent="mdAndUp"
        location="right"
        width="300"
        @click="showInfos = !showInfos"
    >
        <!-- TODO: Use VNotification or whatever to state if current character is ready -->
        <VCard
            v-if="currentUser"
            :prepend-avatar="currentUser.avatar"
            :title="currentUser.username"
            :subtitle="`@${currentUser.handle}`"
            variant="flat"
            class="cursor-pointer"
        >
            <VExpandTransition>
                <div v-show="showInfos">
                    <VDivider />
                    <VCardText>
                        I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.
                    </VCardText>
                </div>
            </VExpandTransition>
        </VCard>

        <VDivider />

        <VList>
            <VListSubheader
                title="Utilisateurs connectés"
            />
        </VList>
    </VNavigationDrawer>

    <!-- <VMain>

    </VMain> -->
    <slot name="default" />
</template>
