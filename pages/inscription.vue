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
    return 'bjr'
}
</script>

<template>
    <Form @submit="signup">
        <h2 class="text-center mb-6 text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold">
            Connexion
        </h2>
        <Field
            name="email"
        />
        <ErrorMessage name="email" />
        <p
            v-if="error !== ''"
            class="text-red-600 mb-4"
        >
            {{ error }}
        </p>
    </Form>
</template>
