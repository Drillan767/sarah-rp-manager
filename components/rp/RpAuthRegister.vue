<script setup lang="ts">
import { useForm, useIsFormValid } from 'vee-validate'
import { vuetifyConfig } from '~/composables/vuetifyConfig'
import useSnackBar from '~/composables/snackbar'

interface IRegister {
    email: string
    username: string
    password: string
    repeatPassword: string
}

const props = defineProps<{ loading: boolean }>()
const emit = defineEmits<{
    (e: 'update:loading', value: boolean): void
    (e: 'register'): void
}>()

const { t } = useI18n()
const router = useRouter()
const { showSuccess } = useSnackBar()

const { defineField, handleSubmit } = useForm<IRegister>({
    validationSchema: {
        email: 'email|unique:email|required',
        username: 'min:4|unique:username|required',
        password: 'required|min:6',
        repeatPassword: 'required:confirmed@password',
    },
})

const [email, emailProps] = defineField('email', vuetifyConfig)
const [username, usernameProps] = defineField('username', vuetifyConfig)
const [password, passwordProps] = defineField('password', vuetifyConfig)
const [repeatPwd, repeatPwdProps] = defineField('repeatPassword', vuetifyConfig)

const formValid = useIsFormValid()

const loadingProxy = computed({
    get: () => props.loading,
    set: value => emit('update:loading', value),
})

const submit = handleSubmit(async (form) => {
    loadingProxy.value = true
    const { data } = await useFetch('/api/auth/register', {
        method: 'POST',
        body: form,
    })

    if (data.value) {
        showSuccess(t('register.success'))
        emit('register')
    }
})
</script>

<template>
    <VForm
        class="mt-4"
        @submit.prevent="submit"
    >
        <VContainer>
            <VRow>
                <VCol>
                    <VTextField
                        v-bind="emailProps"
                        v-model="email"
                        :label="t('fields.email')"
                        :clearable="true"
                        class="mb-4"
                        type="email"
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <VTextField
                        v-bind="usernameProps"
                        v-model="username"
                        :label="t('fields.username')"
                        class="mb-4"
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <VTextField
                        v-bind="passwordProps"
                        v-model="password"
                        :label="t('fields.password')"
                        class="mb-4"
                        type="password"
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <VTextField
                        v-bind="repeatPwdProps"
                        v-model="repeatPwd"
                        :label="t('fields.confirm_password')"
                        class="mb-4"
                        type="password"
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol class="d-flex justify-end pe-0">
                    <VBtn
                        variant="text"
                        @click="router.push('/')"
                    >
                        {{ t('form.cancel') }}
                    </VBtn>
                    <VBtn
                        color="primary"
                        variant="text"
                        :disabled="!formValid"
                        type="submit"
                    >
                        {{ t('form.register') }}
                    </VBtn>
                </VCol>
            </VRow>
        </VContainer>
    </VForm>
</template>
