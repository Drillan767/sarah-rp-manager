<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup';

const { t } = useI18n()
const client = useSupabaseClient()
const router = useRouter()

useHead({
    title: t('login.action'),
})

const validationSchema = yup.object().shape({
    email: yup.
        string()
        .email(t('form.email'))
        .required(t('form.required')),
    password: yup
        .string()
        .min(6, t('form.minLength', 6))
        .required(t('form.required')),
})

const { handleSubmit } = useForm({ validationSchema })

const email = useField('email', validationSchema)
const password = useField('password', validationSchema)

const loading = ref(false)
const error = ref('')

const signin = handleSubmit(async(values) => {
    error.value = '';
    loading.value = true

    try {
        const { error } = await client.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        })

        if (error)
            throw error

        await router.push('/')
    }
    catch (e: any) {
        error.value = e.message
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
            v-if="error !== ''"
            type="error"
            :text="error"
            class="mb-4"
        />

        <VTextField
            :label="t('fields.email')"
            variant="underlined"
            color="primary"
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            class="mb-4"
        />
        <VTextField
            :label="t('fields.password')"
            variant="underlined"
            color="primary"
            type="password"
            v-model="password.value.value"
            :error-messages="password.errorMessage.value"
            class="mb-4"
        />

        <div class="d-flex justify-center">
            <div class="d-flex justify-center w-full lg:w-1/2">
                <VBtn
                    :loading="loading"
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
