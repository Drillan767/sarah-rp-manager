<script setup lang="ts">
import type { Database} from "~/types/supabase"
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup';
import useSnackBar from '~/composables/snackbar'

const { t } = useI18n()
const supabase = useSupabaseClient<Database>()
const session = useSupabaseUser()
const { showSuccess } = useSnackBar()

const validationSchema = yup.object().shape({
    username: yup
        .string()
        .min(4, t('form.minLength', 4))
        .required(t('form.required')),
    description: yup
        .string()
        .nullable()
})

const { handleSubmit } = useForm({ validationSchema })

// Email never changes
const email = ref('')
const username = useField('username', validationSchema)
const description = useField('description', validationSchema)

const loading = ref(false)

onMounted(async() => {
    loading.value = true
    const { data } = await supabase
        .from('users')
        .select('email, username, description')
        .eq('session_id', session.value!.id)
        .single()

    if (data) {
        email.value = data.email
        username.value.value = data.username
        description.value.value = data.description ?? ''
    }
    loading.value = false
})

const submit = handleSubmit(async (values) => {
    loading.value = true

    await supabase
        .from('users')
        .update(values)
        .eq('session_id', session.value!.id)

    loading.value = false

    showSuccess(t('pages.profile.success.infos'))
})
</script>

<template>
    <VCard
        prepend-icon="mdi-account"
        :loading="loading"
        class="mb-4"
    >
        <template #title>
            {{ t('pages.profile.page') }}
        </template>

        <VForm @submit.prevent="submit">
            <VContainer>
                <VRow>
                    <VCol
                        cols="12"
                        md="6"
                    >
                        <VTextField
                            :label="t('fields.email')"
                            color="primary"
                            variant="outlined"
                            v-model="email"
                            :disabled="true"
                        />
                    </VCol>
                    <VCol
                        cols="12"
                        md="6"
                    >
                        <VTextField
                            :label="t('fields.username')"
                            color="primary"
                            variant="outlined"
                            v-model="username.value.value"
                            :error-messages="username.errorMessage.value"
                        />
                    </VCol>
                </VRow>
                <VRow>
                    <VCol>
                        <VTextarea
                            label="Description"
                            variant="outlined"
                            v-model="description.value.value"
                            :auto-grow="true"
                            color="primary"
                        />
                    </VCol>
                </VRow>
            </VContainer>
            <VCardActions class="d-flex justify-end">
                <VBtn
                    color="primary"
                    type="submit"
                >
                    {{ t('form.save') }}
                </VBtn>
            </VCardActions>
        </VForm>
    </VCard>
</template>
