<script setup lang="ts">
import useSnackBar from '~/composables/snackbar'

const { t } = useI18n()
const supabase = useSupabaseClient()
const { showSuccess } = useSnackBar()

const { defineField, handleSubmit, handleReset } = useForm({
    validationSchema: {
        password: 'required|min:6',
        repeatPassword: 'required|confirmed:@password',
    },
})

const [pwd, pwdProps] = defineField('password', vuetifyConfig)
const [confirmPwd, confirmPwdProps] = defineField('repeatPassword', vuetifyConfig)

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
                            v-model="pwd"
                            v-bind="pwdProps"
                            :label="t('fields.password')"
                            type="password"
                        />
                    </VCol>
                    <VCol
                        cols="12"
                        md="6"
                    >
                        <VTextField
                            v-bind="confirmPwdProps"
                            v-model="confirmPwd"
                            :label="t('fields.confirm_password')"
                            type="password"
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
