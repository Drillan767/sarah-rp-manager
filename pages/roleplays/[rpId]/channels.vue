<script setup lang="ts">
import { useDisplay } from 'vuetify'
import CreateChannelDialog from '~/components/channels/CreateChannelDialog.vue'
import RPInformations from '~/components/rp/access/RPInformations.vue'
import NavBarMenu from '~/components/layout/NavBarMenu.vue'
import useRealtimeMessages from '~/composables/realtimeMessages'
import type { Database, Tables } from '~/types/supabase'

definePageMeta({
    layout: 'channels',
})

const { t } = useI18n()
const route = useRoute()
const supabase = useSupabaseClient<Database>()
const supabaseUser = useSupabaseUser()
const { mdAndUp } = useDisplay()
const { currentUser } = storeToRefs(useCurrentUser())

const {
    loadAll,
    onlineUsers,
    publicChannels,
    privateChannels,
    messages,
    disconnect,
} = useRealtimeMessages(route.params.rpId.toString())

const roleplay = ref<Tables<'roleplays'>>()
const roleplayLoading = ref(false)
const showRPInfos = ref(false)
const channelsDrawer = ref(true)
const showChannelCreation = ref(false)
const charactersDrawer = ref(true)
const showOwnInfos = ref(false)

useHead({
    title: () => roleplay.value?.title ?? '',
})

const openDiscussions = computed<string[]>(() => {
    const discussions = privateChannels.value.reduce((acc, channel) => {
        const cu = channel.channels_users.find(cu => cu.user_id !== currentUser.value?.id)

        if (cu)
            acc.push(cu.user_id)

        return acc
    }, [] as string[])

    return discussions
})

async function loadRoleplay() {
    roleplayLoading.value = true
    const { data } = await supabase
        .from('roleplays')
        .select('*, roles(*)') // load EVERYTHING
        .eq('id', route.params.rpId.toString())
        .single()

    if (data) {
        roleplay.value = data

        roleplayLoading.value = false

        if (supabaseUser.value) {
            const { user_metadata: twitter } = supabaseUser.value
            currentUser.value = {
                id: supabaseUser.value.id,
                handle: twitter.user_name,
                username: twitter.name,
                avatar: twitter.picture,
            }
        }
    }
    else {
        throw createError({
            statusCode: 404,
            statusMessage: 'RP not found',
            fatal: true,
        })
    }
}

watch(() => route.params.rpId, async (newRpId, oldRpId) => {
    // Clean up existing subscriptions
    if (oldRpId)
        disconnect()

    // Set up new subscriptions
    await loadRoleplay()
    await loadAll()
}, { immediate: true })
</script>

<template>
    <VAppBar
        :title="roleplay?.title ?? ''"
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
        <VList v-if="roleplay">
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

    <NuxtPage :messages :roleplay />

    <CreateChannelDialog
        v-if="roleplay"
        v-model="showChannelCreation"
        :online-users="onlineUsers"
        :rp-id="roleplay.id"
        :open-discussions="openDiscussions"
        @close="showChannelCreation = false"
    />

    <RPInformations
        v-if="roleplay"
        v-model="showRPInfos"
        :roleplay="roleplay"
    />
</template>
