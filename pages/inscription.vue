<script setup lang="ts">
import { confirmed, email, min, required } from '@vee-validate/rules'
import { ErrorMessage, Field, Form, configure, defineRule } from 'vee-validate'
import { localize } from '@vee-validate/i18n'
import type { Database } from '@/types/supabase'

const supabase = useSupabaseClient<Database>()

defineRule('email', email)
defineRule('required', required)
defineRule('confirmed', confirmed)
defineRule('min', min)

useHead({
    title: 'Inscription',
})

configure({
    generateMessage: localize('fr', {
        messages: {
            required: 'Le champ est requis',
            email: 'Format d\'email non valide',
            confirmed: 'Les mots de passe ne correspondent pas',
        },
    }),
})

const form = ref({
    email: '',
    username: '',
    password: '',
    confirmed_password: '',
})

const loading = ref(false)
const success = ref(false)
const error = ref('')

async function signup() {
    error.value = ''
    loading.value = true

    try {
        const { count: userCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('username', form.value.username)

        if (userCount && userCount > 0)
            throw new Error('Un utilisateur existe déjà avec cet identifiant.')

        const { count: emailCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('email', form.value.email)

        if (emailCount && emailCount > 0)
            throw new Error('Un utilisateur existe déjà avec cet email.')

        /*         const { data, error: signUpError } = await supabase
            .auth
            .signUp({
                email: form.value.email,
                password: form.value.password,
                options: {
                    data: {
                        username: form.value.username,
                    },
                },
            })

        if (signUpError) {
            throw error
        }
        else {
            const { error: insertError } = await supabase
                .from('users')
                .insert({
                    email: form.value.email,
                    session_id: data.user!.id,
                    username: form.value.username,
                })

            if (insertError)
                throw insertError
        } */
    }
    catch (e: any) {
        error.value = e.message
    }
    finally {
        loading.value = false
    }
}
</script>

<template>
    <Form
        v-slot="{ errors }"
        @submit="signup"
    >
        <h2 class="text-center mb-6 text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold">
            Inscription
        </h2>
        <div
            v-if="success"
            class="alert alert-success mb-4"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
            ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            /></svg>
            <span>
                Inscription effectuée avec succès, veuillez activer votre grâce au lien envoyé par email.
            </span>
        </div>
        <div
            v-if="error !== ''"
            class="alert alert-error clear-left mb-4"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
            ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            /></svg>
            <span>{{ error }}</span>
        </div>
        <div class="mb-4">
            <p class="text-sm font-bold text-gray-900 tracking-wide">
                Adresse email
            </p>
            <Field
                v-model="form.email"
                name="email"
                type="email"
                class="field"
                rules="email|required"
                placeholder="sarah@gmail.com"
            />
            <ErrorMessage
                name="email"
                class="text-red-500"
            />
        </div>
        <div class="mb-4">
            <p class="text-sm font-bold text-gray-900 tracking-wide">
                Identifiant
            </p>
            <Field
                v-model="form.username"
                name="username"
                type="text"
                class="field"
                rules="required"
                placeholder="Sarah"
            />
            <ErrorMessage
                name="username"
                class="text-red-500"
            />
        </div>
        <div class="mb-4">
            <p class="text-sm font-bold text-gray-900 tracking-wide">
                Mot de passe
            </p>
            <Field
                v-model="form.password"
                name="password"
                type="password"
                class="field"
                rules="min:6|required"
                placeholder="Mot de passe"
            />
            <ErrorMessage
                name="password"
                class="text-red-500"
            />
        </div>
        <div class="mb-4">
            <p class="text-sm font-bold text-gray-900 tracking-wide">
                Répéter le mot de passe
            </p>
            <Field
                v-model="form.confirmed_password"
                name="confirmed_password"
                type="password"
                class="field"
                rules="confirmed:@password|required"
                placeholder="Mot de passe"
            />
            <ErrorMessage
                name="confirmed_password"
                class="text-red-500"
            />
        </div>
        <div class="mt-10 flex justify-center">
            <button
                class="btn-primary btn btn-wide"
                :disabled="loading || Object.keys(errors).length > 0"
            >
                <span
                    v-if="loading"
                    class="loading loading-spinner"
                />
                Inscription
            </button>
        </div>

        <div class="mt-4 text-sm font-display font-semibold text-gray-700 text-center">
            <span>
                Vous avez un compte ?
                <NuxtLink
                    to="/connexion"
                    class="cursor-pointer text-indigo-600 hover:text-indigo-800"
                >
                    Connexion
                </NuxtLink>
            </span>
        </div>
    </Form>
</template>

<style scoped>
.field {
    @apply w-full text-lg py-2 border-b text-gray-700 border-gray-300 focus:outline-none focus:border-indigo-500 bg-white;
}
</style>
