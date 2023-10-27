<script setup lang="ts">
import type { Database } from '@/types/supabase'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup';

const { t } = useI18n()
const supabase = useSupabaseClient<Database>()
const router = useRouter()

useHead({
    title: t('register.action'),
})

const validationSchema = yup.object().shape({
    email: yup.
        string()
        .email(t('form.email'))
        .required(t('form.required')),
    username: yup
        .string()
        .min(6, t('form.minLength', 6))
        .required(t('form.required')),
    password: yup
        .string()
        .min(6, t('form.minLength', 6))
        .required(t('form.required')),
    passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password')], t('form.confirmed'))
        .required(t('form.required')),
})

const { handleSubmit } = useForm({ validationSchema })

const email = useField('email', validationSchema)
const username = useField('username', validationSchema)
const password = useField('password', validationSchema)
const passwordConfirmation = useField('passwordConfirmation', validationSchema)

const valid = ref(false)
const loading = ref(false)
const success = ref(false)
const error = ref('')

const submit = handleSubmit(async(values) => {
    error.value = ''
    success.value = false
    loading.value = true

    try {
        const { count: userCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('username', values.username)

        if (userCount && userCount > 0)
            throw new Error('Un utilisateur existe déjà avec cet identifiant.')

        const { count: emailCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('email', values.email)

        if (emailCount && emailCount > 0)
            throw new Error('Un utilisateur existe déjà avec cet email.')

        const { data: signupData } = await supabase
            .auth
            .signUp({
                email: values.email,
                password: values.password,
            })

        const { error: insertError } = await supabase
            .from('users')
            .insert({
                email: values.email,
                session_id: signupData.user!.id,
                username: values.username,
            })

        if (insertError)
            throw insertError

        success.value = true
    }
    catch (e: any) {
        error.value = e.message
    }
    finally {
        loading.value = false
    }
})

</script>

<template>
    <VForm @submit.prevent="submit" v-model="valid">
        <h2 class="text-center mb-6 text-4xl text-indigo-900 font-display font-semibold text-lg-left xl:text-5xl xl:text-bold">
            {{ t('register.action') }}
        </h2>

        <VAlert
            v-if="error !== ''"
            type="error"
            :text="error"
            class="mb-4"
        />

        <VAlert
            v-if="success"
            type="success"
            :text="t('register.success')"
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
            :label="t('fields.username')"
            variant="underlined"
            color="primary"
            v-model="username.value.value"
            :error-messages="username.errorMessage.value"
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

        <VTextField
            :label="t('fields.confirm_password')"
            variant="underlined"
            color="primary"
            type="password"
            v-model="passwordConfirmation.value.value"
            :error-messages="passwordConfirmation.errorMessage.value"
            class="mb-4"
        />

        <div class="d-flex justify-center">
            <div class="d-flex justify-center w-full">
                <VBtn
                    :loading="loading"
                    :disabled="!valid || loading"
                    elevation="0"
                    type="submit"
                    color="primary"
                    size="large"
                    rounded="lg"
                    :block="true"
                >
                    {{ t('register.action') }}
                </VBtn>
            </div>
        </div>

        <div class="">
            <p>
                {{ t('register.accountExists') }}
                <NuxtLink
                    to="/login"
                    class=""
                >

                    {{ t('login.action') }}
                </NuxtLink>
            </p>
        </div>
    </VForm>
</template>
