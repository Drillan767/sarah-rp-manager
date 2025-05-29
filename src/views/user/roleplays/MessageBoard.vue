<script setup lang="ts">
import type { Toast } from '@/types'
import { useForm } from 'vee-validate'
import { inject, ref } from 'vue'
import useRoleplays from '@/composables/roleplays'
import vuetifyConfig from '@/composables/vuetifyConfig'

interface Props {
    messageBoard: string | null | undefined
    roleplayId: string
    loading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'saved'): void
}>()

const { updateMessageBoard } = useRoleplays()
const toast = inject<Toast>('toast')

const mbLoading = ref(false)

const { handleSubmit, defineField } = useForm<{ messageBoard: string }>({
    initialValues: {
        messageBoard: props.messageBoard ?? undefined,
    },
})

const [messageBoard, messageBoardProps] = defineField('messageBoard', vuetifyConfig)

const onSubmit = handleSubmit(async (values) => {
    mbLoading.value = true
    await updateMessageBoard(props.roleplayId, values.messageBoard)
    emit('saved')
    toast?.showSuccess('Message board mis à jour')
    mbLoading.value = false
})
</script>

<template>
    <VRow>
        <VCol>
            <VCard
                :loading="loading"
                prepend-icon="mdi-sign-real-estate"
                title="Éditer l'annonce"
            >
                <template #text>
                    <VTextField
                        v-bind="messageBoardProps"
                        v-model="messageBoard"
                        :clearable="true"
                        :counter="255"
                        :loading="mbLoading || loading"
                        label="Message"
                    />
                </template>
                <template #actions>
                    <VSpacer />
                    <VBtn
                        :loading="mbLoading || loading"
                        type="submit"
                        color="primary"
                        variant="flat"
                        @click="onSubmit"
                    >
                        Enregistrer
                    </VBtn>
                </template>
            </VCard>
        </VCol>
    </VRow>
</template>
