<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Channel, Character, CurrentUser, Roleplay } from '@/types/models'
import type { Database } from '~/types/supabase'

interface OnlineUser {
    characters: Character[]
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
const charactersLoading = ref(false)
const channelsDrawer = ref(true)
const charactersDrawer = ref(true)
const showInfos = ref(false)
const onlineUsers = ref<OnlineUser[]>([])
const roleplay = ref<Roleplay>()
const privateChannels = ref<Channel[]>([])
const channels = ref<Channel[]>([])
const characters = ref<Omit<Character, 'user'>[]>([])

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
        .on('presence', { event: 'sync' }, updateOnlineUsers)
        .subscribe()
}

function updateOnlineUsers() {
    const presences = Object.values(presence.value.presenceState())

    const result: OnlineUser[] = []

    for (const presence of presences) {
        const onlineUser: OnlineUser = presence[0] as any as OnlineUser

        if (onlineUser.user.handle !== currentUser.value?.handle)
            result.push(onlineUser)
    }

    onlineUsers.value = result
}

onMounted(async () => {
    await setupOnlineUsers()
    await loadUserCharacters()
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
        <slot name="channels" />

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
            <VListItem
                v-for="(user, i) in onlineUsers"
                :key="i"
                :prepend-avatar="user.user.avatar"
                :title="user.user.username"
            />
        </VList>
    </VNavigationDrawer>

    <slot name="default" />
</template>
