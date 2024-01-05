<script setup lang="ts">
import type { Database } from '~/types/supabase'
import { vuetifyConfig } from '~/composables/vuetifyConfig'
import useSnackBar from '~/composables/snackbar'

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'update:message', value: Props['message']): void
}>()
const { t } = useI18n()

interface Props {
    roleplayId?: string
    message?: string
}

const { showSuccess } = useSnackBar()
const supabase = useSupabaseClient<Database>()

const loading = ref(false)

const { defineField, handleSubmit, controlledValues, setValues } = useForm({
    validationSchema: {
        message: 'max:255',
    },
    initialValues: {
        message: props.message,
    },
})

const [message, messageProps] = defineField('message', vuetifyConfig)

const submit = handleSubmit(async ({ message }) => {
    if (!props.roleplayId)
        return

    loading.value = true
    await supabase
        .from('roleplays')
        .update({
            message_board: message,
        })
        .eq('id', props.roleplayId)

    loading.value = false
    showSuccess(t('form.updateConfirmed', { thing: 'message' }))
})

watch(controlledValues, value => emit('update:message', value.message))
watch(() => props.message, value => setValues({ message: value }))
</script>

<template>
    <VRow>
        <VCol>
            <VCard
                :loading="loading"
                prepend-icon="mdi-sign-real-estate"
            >
                <template #title>
                    {{ t('form.edit') }} {{ t('pages.roleplays.form.message') }}
                </template>
                <template #text>
                    <VTextField
                        v-bind="messageProps"
                        v-model="message"
                        label="Message"
                        :clearable="true"
                        :counter="255"
                    />
                </template>
                <template #actions>
                    <VSpacer />
                    <VBtn
                        type="submit"
                        color="primary"
                        @click="submit"
                    >
                        {{ t('form.save') }}
                    </VBtn>
                </template>
            </VCard>
        </VCol>
    </VRow>
</template>
