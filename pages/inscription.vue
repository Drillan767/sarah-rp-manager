<script setup lang="ts">
import { confirmed, email, min, required } from '@vee-validate/rules'
import { ErrorMessage, Field, Form, configure, defineRule } from 'vee-validate'
import { localize } from '@vee-validate/i18n'

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
    console.log('bjr')
}
</script>

<template>
    <Form @submit="signup">
        <h2 class="text-center mb-6 text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold">
            Inscription
        </h2>
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
                :disabled="loading"
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
