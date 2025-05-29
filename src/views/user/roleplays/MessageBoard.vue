<script setup lang="ts">
import { useForm } from 'vee-validate'
import vuetifyConfig from '@/composables/vuetifyConfig'
import useRoleplays from '@/composables/roleplays'
import { ref } from 'vue'

interface Props {
    messageBoard: string | null | undefined
    roleplayId: string
    loading: boolean
}

const props = defineProps<Props>()

const { updateMessageBoard } = useRoleplays()

const emit = defineEmits<{
    (e: 'saved'): void
}>()

const mbLoading = ref(false)

const { handleSubmit, defineField } = useForm<{ messageBoard: string | null | undefined }>({
    initialValues: {
        messageBoard: props.messageBoard,
    },
})

const [messageBoard, messageBoardProps] = defineField('messageBoard', vuetifyConfig)

const onSubmit = handleSubmit(async(values) => {
    if (!values.messageBoard) {
        return
    }
    mbLoading.value = true
    await updateMessageBoard(props.roleplayId, values.messageBoard)
    emit('saved')
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