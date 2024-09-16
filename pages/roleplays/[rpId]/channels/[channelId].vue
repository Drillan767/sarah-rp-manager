<script setup lang="ts">
import type { VTextarea } from 'vuetify/components'
import { onKeyStroke, onStartTyping } from '@vueuse/core'
import type { CurrentUser } from '~/types/models'
import type { Database, Tables } from '~/types/supabase'
import Message from '~/components/channels/Message.vue'

type MessageType = Tables<'messages'> & {
    user: {
        id: string
        username: string
        avatar: string
    }
}

interface Props {
    roleplay: Tables<'roleplays'>
    messages: MessageType[]
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

const relatedMessages = computed(() => props.messages.filter(m => m.channel_id === route.params.channelId.toString()))

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

    message.value = undefined
}

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

    <VVirtualScroll
        :items="relatedMessages"
        height="500"
    >
        <template #default="{ item }">
            <Message :message="item" />
        </template>
    </VVirtualScroll>

    <VRow>
        <VCol>
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
