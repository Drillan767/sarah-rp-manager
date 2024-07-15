<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
import {
    REALTIME_LISTEN_TYPES,
    REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
    REALTIME_PRESENCE_LISTEN_EVENTS,
    REALTIME_SUBSCRIBE_STATES,
    RealtimeChannel,
} from '@supabase/supabase-js'
import { VListItemTitle, VListSubheader } from 'vuetify/components'
import type { Channel, CurrentUser } from '@/types/models'
import type { Database } from '~/types/supabase'

const route = useRoute()
const supabase = useSupabaseClient<Database>()
const { mdAndUp } = useDisplay()
const currentUser = useState<CurrentUser | undefined>('current-user')

const { params: { rpId } } = route

const channelsDrawer = ref(true)
const charactersDrawer = ref(true)
const channels = ref<Channel[]>([])

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
    const { data } = await supabase
        .from('channels')
        .select('*')
        .eq('roleplay_id', rpId.toString())

    if (data) {
        channels.value = data
    }

    // Setting up event listeners
    supabase
        .channel(`channels-${rpId.toString()}`)
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

onMounted(() => channelsActivity())
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
                    <VCol cols="3" class="d-flex align-center justify-center">
                        <p>Bjr</p>
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
        <VList>
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

        <template #append>
            <VBtn block>
                test
            </VBtn>
        </template>
    </VNavigationDrawer>

    <VNavigationDrawer
        v-model="charactersDrawer"
        :permanent="mdAndUp"
        location="right"
    >
        <VList>
            <VListItem />
        </VList>

        <template #prepend>
            <VBtn
                :block="true"
            />
        </template>
        <!-- <slot name="characters" /> -->
    </VNavigationDrawer>

    <!-- <VMain>

    </VMain> -->
    <slot name="default" />
</template>
