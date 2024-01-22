<script setup lang="ts">
import type { Database } from '~/types/supabase'
import useSnackBar from '~/composables/snackbar'

interface Channel {
    id: number
    name: string
    roleplay_id: string
}

interface Props {
    roleplayId?: string
    loading: boolean
    channels: Channel[]
}

const props = withDefaults(defineProps<Props>(), {
    roleplayId: undefined,
})

const emit = defineEmits<{
    (e: 'update'): void
    (e: 'update:loading', value: boolean): void
    (e: 'fetch'): void
    (e: 'delete', value: number): void
}>()

const { t } = useI18n()
const supabase = useSupabaseClient<Database>()
const { showSuccess } = useSnackBar()

const channelsList = ref<Channel[]>([])
const selectedChannel = ref<Channel>({} as Channel)
const displayDeleteModal = ref(false)

const loadingProxy = computed({
    get: () => props.loading,
    set: value => emit('update:loading', value),
})

const cantUpdate = computed(() => {
    const channelNames = channelsList.value.map(c => c.name)
    return channelNames.includes('') || new Set(channelNames).size !== channelNames.length
})

async function handleDeleteChannel(channel: Channel) {
    if (channel.id === 0) {
        channelsList.value.filter(c => c.id !== 0)
    }
    else {
        selectedChannel.value = channel
        displayDeleteModal.value = true
    }
}

function addChannel() {
    if (!props.roleplayId)
        return

    channelsList.value.push({
        id: 0,
        name: '',
        roleplay_id: props.roleplayId,
    })
}

async function deleteChannel() {
    loadingProxy.value = true
    await supabase
        .from('channels')
        .delete()
        .eq('id', selectedChannel.value.id)

    displayDeleteModal.value = false
    loadingProxy.value = false

    showSuccess(t('form.deleteConfirmed', { thing: t('pages.roleplays.channel.self', 1) }))
    emit('fetch')
}

watch(() => props.channels, (value) => {
    channelsList.value = value
})
</script>

<template>
    <VCard
        prepend-icon="mdi-forum"
        :loading="loading"
        :title="t('pages.roleplays.channel.self')"
    >
        <template #text>
            <VRow>
                <RpChannelForm
                    v-for="(channel, i) in channelsList"
                    :key="i"
                    v-model:channel="channelsList[i]"
                    @delete="handleDeleteChannel(channel)"
                />
            </VRow>
        </template>
        <template #actions>
            <VSpacer />
            <VBtn
                color="green"
                prepend-icon="mdi-plus"
                @click="addChannel"
            >
                Ajouter un canal
            </VBtn>
            <VBtn
                color="primary"
                :disabled="cantUpdate"
                @click="emit('update')"
            >
                {{ t('form.save') }}
            </VBtn>
        </template>
    </VCard>
    <VDialog
        v-model="displayDeleteModal"
        width="800"
    >
        <VCard
            :title="t('pages.roleplays.delete.channel')"
            :text="t('pages.roleplays.delete.channel_message')"
        >
            <template #actions>
                <VSpacer />
                <VBtn
                    :disabled="loadingProxy"
                    @click="displayDeleteModal = false"
                >
                    {{ t('form.cancel') }}
                </VBtn>
                <VBtn
                    color="red"
                    :disabled="loadingProxy"
                    :loading="loadingProxy"
                    @click="deleteChannel"
                >
                    {{ t('form.delete') }}
                </VBtn>
            </template>
        </VCard>
    </VDialog>
</template>
