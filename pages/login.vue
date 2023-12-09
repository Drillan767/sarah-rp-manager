<script setup lang="ts">
import { useForm, useIsFormValid } from 'vee-validate'
import { vuetifyConfig } from '@/composables/vuetifyConfig'

const { t } = useI18n()
const client = useSupabaseClient()
const router = useRouter()

const { defineField, handleSubmit, values: loginValues } = useForm({
    validationSchema: {
        email: 'email|required',
        password: 'required'
    },
    initialValues: {
        email: '',
        password: '',
    }
})

const [email, emailProps] = defineField('email', vuetifyConfig)
const [password, passwordProps] = defineField('password', vuetifyConfig)
const formValid = useIsFormValid()

useHead({
    title: t('login.action'),
})

const globalError = ref('')
const loading = ref(false)

const signin = handleSubmit(async(values) => {
    globalError.value = ''
    loading.value = true

    try {
        const { error } = await client.auth.signInWithPassword(loginValues)

        if (error)
            throw error

        await router.push('/')
    }
    catch (e: any) {
        globalError.value = e.message
        loading.value = false
    }
})

</script>

<template>
    <VForm @submit.prevent="signin">
        <h1 class="text-h3 font-weight-bold text-indigo">
            {{ t('login.action') }}
        </h1>

        <VAlert
            v-if="globalError !== ''"
            type="error"
            :text="globalError"
            class="mb-4"
        />

        <VTextField
            v-bind="emailProps"
            v-model="email"
            variant="underlined"
            :label="t('fields.email')"
            class="mb-4"
        />

        <VTextField
            v-bind="passwordProps"
            v-model="password"
            :label="t('fields.password')"
            variant="underlined"
            type="password"
            class="mb-4"
        />

        <div class="d-flex justify-center">
            <div class="d-flex justify-center w-full lg:w-1/2">
                <VBtn
                    :loading="loading"
                    :disabled="!formValid"
                    elevation="0"
                    type="submit"
                    color="primary"
                    size="large"
                    rounded="lg"
                    :block="true"
                >
                    {{ t('login.action') }}
                </VBtn>
            </div>
        </div>

        <div class="mt-4 text-sm font-display font-semibold text-gray-700 text-center">
            <p>
                <NuxtLink
                    to="/forgot-password"
                    class="text-indigo font-weight-bold text-decoration-none"
                >
                    {{ t('forgotPwd.title') }}
                </NuxtLink>
            </p>

            <p>
                {{ t('login.noAccount') }}
                <NuxtLink
                    to="/register"
                    class="text-indigo font-weight-bold text-decoration-none"
                >
                    {{ t('register.action') }}
                </NuxtLink>
            </p>
        </div>
    </VForm>
</template>

<style scoped>
</style>
