<script setup lang="ts">
import { useForm } from 'vee-validate'
import { vuetifyConfig } from '~/composables/vuetifyConfig';

const { t } = useI18n()

useHead({
    title: t('forgotPwd.title'),
})

const { defineField, handleSubmit } = useForm({
    validationSchema: {
        email: 'email|required',
    }
})

const [email, emailProps] = defineField('email', vuetifyConfig)

const client = useSupabaseClient()

const success= ref(false)
const loading = ref(false)

const submit = handleSubmit(async(values) => {
    loading.value = true
    await client.auth.resetPasswordForEmail(values.email, {
        redirectTo: 'https://sarah-rp.fr/new-password',
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
            v-bind="emailProps"
            v-model="email"
            :label="t('fields.email')"
            variant="underlined"
            color="primary"
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
                    {{ t('forgotPwd.action') }}
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