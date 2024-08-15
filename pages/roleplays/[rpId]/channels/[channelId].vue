<script setup lang="ts">
import type { VTextarea } from 'vuetify/components'
import { onKeyStroke, onStartTyping } from '@vueuse/core'
import type { CurrentUser } from '~/types/models'
import type { Database, Tables } from '~/types/supabase'

interface Props {
    roleplay: Tables<'roleplays'>
    messages: Tables<'messages'>[]
}

const props = defineProps<Props>()

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient<Database>()
const currentUser = useState<CurrentUser>('current-user')
const { t } = useI18n()

const channel = ref<Tables<'channels'>>()
const showDialog = ref(false)
const message = ref<string>()
const textarea = ref<VTextarea>()
// const messages = ref<Tables<'messages'>[]>([])
// const dbRealTime = ref<RealtimeChannel>(supabase.channel(`messages-${route.params.rpId.toString()}`))

const canEditDelete = computed(() => {
    if (!channel.value?.internal)
        return true

    return channel.value.internal && props.roleplay.user_id === currentUser.value.id
})

onKeyStroke('Enter', (e) => {
    e.preventDefault()
    sendMessage()
})

onStartTyping(() => {
    if (!textarea.value?.active)
        textarea.value?.focus()
})

async function loadChannel() {
    const { data } = await supabase
        .from('channels')
        .select('*')
        .eq('id', route.params.channelId.toString())
        .single()

    if (data)
        channel.value = data
}

async function deleteChannel() {
    await useFetch('/api/channels/remove', {
        method: 'DELETE',
        body: {
            id: route.params.channelId.toString(),
        },
    })

    router.push(`/roleplays/${route.params.rpId.toString()}/channels`)

    showDialog.value = false
}

async function sendMessage() {
    if (!message.value)
        return

    await supabase
        .from('messages')
        .insert({
            channel_id: route.params.channelId.toString(),
            message: message.value,
            user_id: currentUser.value.id,
        })
}

/*
I have a Supabase question:

I authentify my users through a Twitter SSO. Supabase then creates a user in the "auth" schema if it doesn't exist. This row contains the UUID of the SSO login, that sould theorically be unique. In my auth flow, I also insert a row in a a "users" table, in the "public" schema, with the Twitter SSO's UUID in one of the column.

However, to me, the Twitter's UUID should be the primary key. I store in on my project as the "user_id" but I cannot use it as a foreign key. And now, I feel conflicted because I need to make a RLS rule, but auth.uid() is not equal to users.id, which would help dramatically if it was the case.

My question is: is it a good idea to set the row's id as the Twitter's uuid when creating a new user?
*/

watch(() => route.params, (value) => {
    if (value.channelId)
        loadChannel()
}, { immediate: true })
</script>

<template>
    <VAppBar
        :title="channel?.name"
        flat
        tile
        class="border-b-sm"
    >
        <template #append>
            <VMenu location="bottom end">
                <template #activator="{ props: menu }">
                    <VBtn
                        v-bind="menu"
                        variant="flat"
                        icon="mdi-dots-horizontal"
                    />
                </template>
                <VList>
                    <VListItem
                        v-if="canEditDelete"
                        :title="t('form.edit_thing', { thing: t('fields.name') })"
                        prepend-icon="mdi-square-edit-outline"
                    />
                    <VListItem
                        v-if="canEditDelete"
                        :title="t('pages.channels.delete_title')"
                        @click="showDialog = true"
                    >
                        <template #prepend>
                            <VIcon
                                color="error"
                                icon="mdi-trash-can-outline"
                            />
                        </template>
                    </VListItem>
                </VList>
            </VMenu>
        </template>
    </VAppBar>

    <VRow class="flex-column h-100">
        <VCol class="flex-grow-1 flex-shrink-0">
            <p>Ici les messages qui arrivent truc de fou</p>
        </VCol>
        <VCol class="flex-shrink-1 flex-grow-0">
            <VTextarea
                ref="textarea"
                v-model="message"
                placeholder="Ecrivez votre message..."
                label="Message"
                counter
            />
        </VCol>
    </VRow>

    <VDialog
        v-model="showDialog"
        width="960"
    >
        <VCard
            :title="t('form.remove_thing', { thing: channel?.name })"
            :text="t('pages.channels.delete_message')"
        >
            <template #actions>
                <VSpacer />
                <VBtn
                    @click="showDialog = false"
                >
                    {{ t('form.cancel') }}
                </VBtn>
                <VBtn
                    color="red"
                    @click="deleteChannel"
                >
                    {{ t('form.delete') }}
                </VBtn>
            </template>
        </VCard>
    </VDialog>
</template>
