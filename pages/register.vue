<script setup lang="ts">
import { useForm, useIsFormValid } from 'vee-validate'
import type { Database } from '~/types/supabase'
import { vuetifyConfig } from '~/composables/vuetifyConfig'

const { t } = useI18n()
const supabase = useSupabaseClient<Database>()

useHead({
    title: t('register.action'),
})

const { defineField, handleSubmit, resetForm } = useForm({
    validationSchema: {
        email: 'email|required',
        username: 'min:6|required',
        password: 'min:6|required',
        passwordConfirmation: 'required|confirmed:@password',
    },
})

const [email, emailProps] = defineField('email', vuetifyConfig)
const [username, usernameProps] = defineField('username', vuetifyConfig)
const [pwd, pwdProps] = defineField('password', vuetifyConfig)
const [pwdConfirm, pwdConfirmProps] = defineField('passwordConfirmation', vuetifyConfig)

const formValid = useIsFormValid()

const valid = ref(false)
const loading = ref(false)
const success = ref(false)
const error = ref('')

const submit = handleSubmit(async (values) => {
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
        resetForm()
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
    <VForm v-model="valid" @submit.prevent="submit">
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
            v-bind="emailProps"
            v-model="email"
            :label="t('fields.email')"
            variant="underlined"
            color="primary"
            class="mb-4"
        />

        <VTextField
            v-bind="usernameProps"
            v-model="username"
            :label="t('fields.username')"
            variant="underlined"
            color="primary"
            class="mb-4"
        />

        <VTextField
            v-bind="pwdProps"
            v-model="pwd"
            :label="t('fields.password')"
            variant="underlined"
            color="primary"
            type="password"
            class="mb-4"
        />

        <VTextField
            v-bind="pwdConfirmProps"
            v-model="pwdConfirm"
            :label="t('fields.confirm_password')"
            variant="underlined"
            color="primary"
            type="password"
            class="mb-4"
        />

        <div class="d-flex justify-center">
            <div class="d-flex justify-center w-full">
                <VBtn
                    :loading="loading"
                    :disabled="!formValid || loading"
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

        <div class="text-center mt-4">
            <p>
                {{ t('register.accountExists') }}
                <NuxtLink
                    to="/login"
                    class="text-indigo font-weight-bold text-decoration-none"
                >
                    {{ t('login.action') }}
                </NuxtLink>
            </p>
        </div>
    </VForm>
</template>
