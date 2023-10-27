<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup';

const { t } = useI18n()

useHead({
    title: t('forgotPwd.title'),
})

const validationSchema = yup.object().shape({
    email: yup.
        string()
        .email(t('form.email'))
        .required(t('form.required')),
})

const { handleSubmit } = useForm({ validationSchema })

const email = useField('email', validationSchema)

const client = useSupabaseClient()

const success= ref(false)
const loading = ref(false)

const submit = handleSubmit(async(values) => {
    loading.value = true
    await client.auth.resetPasswordForEmail(values.email, {
        redirectTo: 'https://rp-manager.vercel.app/create-password',
    })

    success.value = true
    loading.value = false
})

</script>

<template>
    <VForm @submit.prevent="submit">

        <h2
            class="text-center text-4xl mb-6 text-indigo-900 font-display font-semibold text-lg-left xl:text-5xl xl:text-bold"
        >
            {{ t('forgotPwd.title') }}
        </h2>
        <VAlert
            v-if="success"
            type="success"
            :text="t('forgotPwd.success')"
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

        <div class="d-flex justify-center">
            <div class="d-flex justify-center w-full lg:w-1/2">
                <VBtn
                    :loading="loading"
                    elevation="0"
                    type="submit"
                    color="primary"
                    size="large"
                    rounded="lg"
                    block
                >
                    {{ t('login.action') }}
                </VBtn>
            </div>
        </div>
        <div class="mt-4 text-sm font-display font-semibold text-gray-700 text-center">
            <p>
                <NuxtLink
                    to="/login"
                    class="text-sm font-display font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                    {{ t('login.action') }}
                </NuxtLink>
            </p>
        </div>
    </VForm>
</template>