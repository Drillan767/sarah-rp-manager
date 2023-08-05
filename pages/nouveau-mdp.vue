<script setup lang="ts">
import { confirmed, min, required } from '@vee-validate/rules'
import { ErrorMessage, Field, Form, configure, defineRule } from 'vee-validate'
import { localize } from '@vee-validate/i18n'

useHead({
    title: 'Mot de passe oublié',
})

defineRule('required', required)
defineRule('confirmed', confirmed)
defineRule('min', min)

configure({
    generateMessage: localize('fr', {
        messages: {
            required: 'Le champ est requis',
            confirmed: 'Les mots de passe ne sont pas identiques',
            min: 'Le mot de passe doit faire faire 6 ',
        },
    }),
})

const client = useSupabaseAuthClient()

const success = ref(false)
const password = ref('')
const confirmPassword = ref('')

const canSubmit = computed(() => {
    return password.value.length > 6
        && confirmPassword.value.length > 6
        && password.value === confirmPassword.value
})

async function submit() {
    await client.auth.updateUser({ password: password.value })
    success.value = true
}
</script>

<template>
    <Form @submit="submit">
        <h2
            class="text-center text-4xl mb-6 text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold"
        >
            Nouveau mot de passe
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
                Votre mot de passe a été changé, vous pouvez désormais vous connecter.
            </span>
        </div>
        <div>
            <div class="text-sm font-bold text-gray-700 tracking-wide">
                Nouveau mot de passe
            </div>
            <Field
                v-model="password"
                name="password"
                type="password"
                class="field"
                rules="required|min:6"
                placeholder="Nouveau mot de passe"
            />
            <ErrorMessage
                name="password"
                class="text-red-500"
            />
        </div>

        <div>
            <div class="text-sm font-bold text-gray-700 tracking-wide">
                Répéter le mot de passe
            </div>
            <Field
                v-model="confirmPassword"
                name="confirmPassword"
                type="password"
                class="field"
                rules="required|min:6|confirmed:@password"
                placeholder="Répéter mot de passe"
            />
            <ErrorMessage
                name="confirmPassword"
                class="text-red-500"
            />
        </div>

        <div class="mt-10 flex justify-center">
            <button
                class="btn-primary btn btn-wide"
                :disabled="!canSubmit"
            >
                Enregistrer
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

<style scoped lang="scss">
.field {
    @apply w-full text-lg py-2 border-b text-gray-700 border-gray-300 focus:outline-none focus:border-indigo-500 bg-white;
}
</style>
