<script setup lang="ts">
import type { Database } from '~/types/supabase'
import useValidation from '~/composables/useValidation'
import useSnackBar from '~/composables/snackbar'

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'update:message', value: Props['message']): void
}>()
const { t } = useI18n()
const { maxLengthRule } = useValidation()

interface Props {
    roleplayId?: string
    message?: string
}

const { showSuccess } = useSnackBar()
const supabase = useSupabaseClient<Database>()

const messageProxy = computed({
    get: () => props.message,
    set: value => emit('update:message', value),
})

const loading = ref(false)
const newMessage = ref('')

async function submit() {
    if (!props.roleplayId)
        return

    loading.value = true
    await supabase
        .from('roleplays')
        .update({
            message_board: newMessage.value,
        })
        .eq('id', props.roleplayId)

    loading.value = false
    showSuccess(t('form.updateConfirmed', { thing: 'message' }))
}
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
                    <VForm>
                        <VTextField
                            v-model="messageProxy"
                            label="Message"
                            variant="outlined"
                            color="primary"
                            :clearable="true"
                            :counter-value="255"
                            :rules="[maxLengthRule(messageProxy?.length ? messageProxy : '', 255)]"
                        />
                    </VForm>
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

<style scoped lang="scss">

</style>
