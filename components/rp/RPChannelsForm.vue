<script setup lang="ts">
import type { Database } from '~/types/supabase'
import useValidation from '~/composables/useValidation'
import useSnackBar from '~/composables/snackbar'

interface Channel {
    name: string,
    id?: number,
}

interface Props {
    roleplayId?: string,
}

const props = defineProps<Props>()

const { t } = useI18n()
const { requiredRule, maxLengthRule } = useValidation()
const { showSuccess } = useSnackBar()
const supabase = useSupabaseClient<Database>()

const loading = ref(false)
const channels = ref<Channel[]>([]);
const displayDeleteModal = ref(false)
const selectedChannel = ref<Channel>({} as Channel)

const fetchChannels = async() => {
    if (!props.roleplayId) return

    loading.value = true
    const { data } = await supabase
        .from('channels')
        .select('id, name')
        .eq('private', false)
        .eq('roleplay_id', props.roleplayId)

    if (data) channels.value = data

    loading.value = false
}

const addChannel = () => {
    channels.value.push({ name: '' })
}

const submit = async() => {
    loading.value = true
    await useFetch('/api/channels/update', {
        body: channels.value.map((c) => ({
            roleplay_id: props.roleplayId,
            ...c,
        })),
        method: 'POST',
    })

    loading.value = false
    showSuccess(t('updateConfirmed', { thing: t('pages.roleplays.channel.self')}))
}

const removeChannel = (i: number) => {
    if ('id' in channels.value[i]) {
        selectedChannel.value = channels.value[i]
    } else {
        channels.value.splice(i, 1)
    }
}

const deleteChannel = async() => {
    await useFetch('/api/channels/remove', {
        body: { id: selectedChannel.value.id },
        method: 'DELETE',
    })

    displayDeleteModal.value = false
    channels.value = channels.value.filter((r) => r.id !== selectedChannel.value.id)

}

watch(() => props.roleplayId, (value) => {
    if (value) fetchChannels()
})

</script>

<template>
    <VCard
        v-if="roleplayId"
        :loading="loading"
        prepend-icon="mdi-forum"
    >
        <template #title>
            {{ t('pages.roleplays.channel.self') }}
        </template>
        <VForm @submit.prevent="submit">
            <VCardText>
                <VContainer>
                    <VRow>
                        <VCol
                            v-for="(channel, i) in channels"
                            :key="i"
                            cols="12"
                            md="4"
                        >
                            <VCard>
                                <VCardText>
                                    <VRow>
                                        <VCol cols="10">
                                            <VTextField
                                                v-model="channel.name"
                                                :label="t('pages.roleplays.form.channel_name')"
                                                :rules="[requiredRule, maxLengthRule(channel.name, 25)]"
                                                variant="outlined"
                                                color="primary"
                                            />
                                        </VCol>
                                        <VCol cols="2">
                                            <VBtn
                                                icon="mdi-trash-can-outline"
                                                color="error"
                                                variant="flat"
                                                @click="removeChannel(i)"
                                            />
                                        </VCol>
                                    </VRow>
                                </VCardText>
                            </VCard>
                        </VCol>
                    </VRow>
                </VContainer>
                <div class="d-flex justify-center">
                <VBtn
                    color="blue"
                    variant="outlined"
                    rounded="xl"
                    prepend-icon="mdi-plus-circle-outline"
                    class="mt-4"
                    @click="addChannel"
                >
                    {{ t('pages.roleplays.form.channel_add') }}
                </VBtn>
            </div>
            </VCardText>
            <VCardActions>
                <VSpacer />
                <VBtn
                    color="primary"
                    type="submit"
                >
                    {{ t('form.save') }}
                </VBtn>
            </VCardActions>
        </VForm>
        <VDialog
            v-model="displayDeleteModal"
        >
            <VCard>
                <template #title>
                    {{ t('pages.roleplays.delete.channel') }}
                </template>
                <template #text>
                    {{ t('pages.roleplays.delete.channel_message') }}
                </template>
                <template #actions>
                    <VSpacer />
                    <VBtn
                        @click="displayDeleteModal = false"
                    >
                        {{ t('form.cancel') }}
                    </VBtn>
                    <VBtn
                        @click="deleteChannel"
                        color="red"
                    >
                        {{ t('form.delete') }}
                    </VBtn>
                </template>
            </VCard>
        </VDialog>
    </VCard>
</template>