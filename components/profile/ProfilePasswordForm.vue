<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup';
import useSnackBar from '~/composables/snackbar'

const { t } = useI18n()
const supabase = useSupabaseClient()
const { showSuccess } = useSnackBar()

const validationSchema = yup.object().shape({
    password: yup
        .string()
        .min(6, t('form.minLength', 6))
        .required(t('form.required')),
    passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password')], t('form.confirmed'))
        .required(t('form.required')),
})

const { handleSubmit, handleReset } = useForm({ validationSchema })
const password = useField('password', validationSchema)
const passwordConfirmation = useField('passwordConfirmation', validationSchema)

const loading = ref(false)

const submit = handleSubmit(async (values) => {
    await supabase
        .auth
        .updateUser({ password: values.password })

    handleReset()

    showSuccess(t('pages.profile.success.password'))
})

</script>

<template>
    <VCard
        prepend-icon="mdi-form-textbox-password"
        :loading="loading"
        class="mb-4"
    >
        <template #title>
            {{ t('pages.profile.password') }}
        </template>

        <VForm @submit.prevent="submit">
            <VContainer>
                <VRow>
                    <VCol
                        cols="12"
                        md="6"
                    >
                        <VTextField
                            :label="t('fields.password')"
                            type="password"
                            color="primary"
                            variant="outlined"
                            v-model="passwordConfirmation.value.value"
                            :error-messages="passwordConfirmation.errorMessage.value"
                        />
                    </VCol>
                    <VCol
                        cols="12"
                        md="6"
                    >
                        <VTextField
                            :label="t('fields.confirm_password')"
                            type="password"
                            color="primary"
                            variant="outlined"
                            v-model="password.value.value"
                            :error-messages="password.errorMessage.value"
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
