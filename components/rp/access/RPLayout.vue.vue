<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { useVModels } from '@vueuse/core'
import type { RealtimeChannel } from '@supabase/supabase-js'
import NavBarMenu from '../../layout/NavBarMenu.vue'
import CreateChannelDialog from '../../channels/CreateChannelDialog.vue'
import RPInformations from './RPInformations.vue'
import type { CurrentUser, OnlineUser } from '@/types/models'
import type { Database, Tables } from '~/types/supabase'

type Channel = Tables<'channels'> & {
    channels_users: Tables<'channels_users'>[]
}

type Character = Tables<'characters'>

interface Props {
    roleplay: Tables<'roleplays'>
    loading: boolean
    privateChannels: Channel[]
    publicChannels: Channel[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'update:public-channels', value: Channel[]): void
    (e: 'update:private-channels', value: Channel[]): void
}>()

const { publicChannels, privateChannels } = useVModels(props, emit)

const supabase = useSupabaseClient<Database>()
const { mdAndUp } = useDisplay()
const currentUser = useState<CurrentUser | undefined>('current-user')
const { t } = useI18n()

const presence = ref<RealtimeChannel>(supabase.channel(`presence-${props.roleplay.id}`))
const dbRealTime = ref<RealtimeChannel>(supabase.channel(`db-${props.roleplay.id}`))
const charactersLoading = ref(false)
const channelsDrawer = ref(true)
const charactersDrawer = ref(true)
const showOwnInfos = ref(false)
const showRPInfos = ref(false)
const showChannelCreation = ref(false)
const onlineUsers = ref<OnlineUser[]>([])
const characters = ref<Omit<Character, 'user'>[]>([])

const openDiscussions = computed<string[]>(() => {
    const test = privateChannels.value.reduce((acc, channel) => {
        const cu = channel.channels_users.find(cu => cu.user_id !== currentUser.value?.id)

        if (cu)
            acc.push(cu.user_id)

        return acc
    }, [] as string[])

    return test
})

async function handleChannelInsert(payload: { new: Channel }) {
    const { data } = await supabase
        .from('channels')
        .select('*, channels_users(*)')
        .eq('id', payload.new.id)
        .single()

    if (data) {
        const isInternal = data.internal
        const exists = (isInternal ? publicChannels.value : privateChannels.value).find(c => c.id === data.id)

        if (exists)
            return

        (isInternal ? publicChannels.value : privateChannels.value).push(data)
    }
}

async function handleChannelUpdate(payload: { new: Channel }) {
    if (payload.new.internal) {
        const index = publicChannels.value.findIndex(c => c.id === payload.new.id)
        publicChannels.value[index] = payload.new
    }
    else {
        const index = privateChannels.value.findIndex(c => c.id === payload.new.id)
        privateChannels.value[index] = payload.new
    }
}

async function handleChannelDeletion(payload: { old: { id: string } }) {
    publicChannels.value = publicChannels.value.filter(c => c.id !== payload.old.id)
    privateChannels.value = privateChannels.value.filter(c => c.id !== payload.old.id)
}

async function channelsActivity() {
    // Setting up event listeners
    dbRealTime.value
        .on('postgres_changes', {
            event: 'insert',
            schema: 'public',
            table: 'channels',
            filter: `roleplay_id=eq.${props.roleplay.id}`,
        }, handleChannelInsert)
        .on('postgres_changes', {
            event: 'update',
            schema: 'public',
            table: 'channels',
            filter: `roleplay_id=eq.${props.roleplay.id}`,
        }, handleChannelUpdate)
        .on('postgres_changes', {
            event: 'delete',
            schema: 'public',
            table: 'channels',
            filter: `roleplay_id=eq.${props.roleplay.id}`,
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
        :title="roleplay.title"
        class="px-6"
    >
        <template #prepend>
            <RouterLink to="/">
                <VAvatar :tile="true" image="/sarah.jpg" />
            </RouterLink>
        </template>
        <template #append>
            <VMenu>
                <template #activator="{ props: menu }">
                    <VBtn
                        v-bind="menu"
                        icon="mdi-dots-vertical"
                    />
                </template>
                <VList>
                    <VListItem
                        title="Informations sur le roleplay"
                        prepend-icon="mdi-information-box-outline"
                        @click="showRPInfos = true"
                    />
                    <VListItem
                        title="Quitter le Roleplay"
                        prepend-icon="mdi-logout"
                        color="red"
                        class="text-error"
                    />
                </VList>
            </VMenu>

            <NavBarMenu :display-username="false" />
        </template>
    </VAppBar>

    <VNavigationDrawer
        v-model="channelsDrawer"
        :permanent="mdAndUp"
    >
        <VList>
            <VListSubheader
                :title="t('pages.channels.main')"
            />
            <VListItem
                v-for="(channel, i) in publicChannels"
                :key="i"
                :to="`/roleplays/${roleplay.id}/channels/${channel.id}`"
                :title="channel.name"
                prepend-icon="mdi-chat-outline"
            >
                <!-- TODO: Handle public channels interaction if user is roleplay's creator -->
            </VListItem>

            <VListSubheader
                v-if="privateChannels.length > 0"
                :title="t('pages.channels.private')"
            />
            <VListItem
                v-for="(channel, i) in privateChannels"
                :key="i"
                :to="`/roleplays/${roleplay.id}/channels/${channel.id}`"
                :title="channel.name"
                prepend-icon="mdi-chat"
            />
        </VList>

        <template #append>
            <div class="pa-2">
                <VBtn
                    prepend-icon="mdi-chat-plus"
                    class="pa-2"
                    variant="outlined"
                    color="primary"
                    block
                    @click="showChannelCreation = true"
                >
                    {{ t('pages.channels.single') }}
                </VBtn>
            </div>
        </template>
    </VNavigationDrawer>

    <VNavigationDrawer
        v-model="charactersDrawer"
        :permanent="mdAndUp"
        location="right"
        width="300"
        @click="showOwnInfos = !showOwnInfos"
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
                <div v-show="showOwnInfos">
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
                :title="t('pages.chat.online_users')"
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

    <CreateChannelDialog
        v-model="showChannelCreation"
        :online-users="onlineUsers"
        :rp-id="roleplay.id"
        :open-discussions="openDiscussions"
        @close="showChannelCreation = false"
    />

    <RPInformations
        v-model="showRPInfos"
        :roleplay="roleplay"
    />
</template>
