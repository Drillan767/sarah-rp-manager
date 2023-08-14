<script setup lang="ts">
import { email, required } from '@vee-validate/rules'
import { ErrorMessage, Field, Form, configure, defineRule } from 'vee-validate'
import { localize } from '@vee-validate/i18n'

useHead({
    title: 'Mot de passe oublié',
})

defineRule('email', email)
defineRule('required', required)

configure({
    generateMessage: localize('fr', {
        messages: {
            required: 'Le champ est requis',
            email: 'Format d\'email non valide',
        },
    }),
})

const client = useSupabaseClient()

const success = ref(false)
const form = ref({
    email: '',
})

async function submit() {
    await client.auth.resetPasswordForEmail(form.value.email, {
        redirectTo: 'https://sarah-rp-manager.vercel.app/nouveau-mdp',
    })

    form.value.email = ''
    success.value = true
}
</script>

<template>
    <Form @submit="submit">
        <h2
            class="text-center text-4xl mb-6 text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold"
        >
            Oubli du mot de passe
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
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <span>
                Un email vous permettant de réinitialiser votre mot de passe a été envoyé à l'adresse email indiquée.
            </span>
        </div>
        <div>
            <div class="text-sm font-bold text-gray-700 tracking-wide">
                Adresse email
            </div>
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

        <div class="mt-10 flex justify-center">
            <button class="btn-primary btn btn-wide">
                Réinitialiser le mot de passe
            </button>
        </div>

        <div class="mt-4 text-sm font-display font-semibold text-gray-700 text-center">
            <NuxtLink
                to="/connexion"
                class="cursor-pointer text-indigo-600 hover:text-indigo-800"
            >
                Connexion
            </NuxtLink>
        </div>
    </Form>
</template>

<style scoped>
.field {
    @apply w-full text-lg py-2 border-b text-gray-700 border-gray-300 focus:outline-none focus:border-indigo-500 bg-white;
}
</style>
