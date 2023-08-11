<script setup lang="ts">
import { email, required } from '@vee-validate/rules'
import { ErrorMessage, Field, Form, configure, defineRule } from 'vee-validate'
import { localize } from '@vee-validate/i18n'

const client = useSupabaseClient()
const router = useRouter()

useHead({
    title: 'Connexion',
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

const form = ref({
    email: '',
    password: '',
})

const loading = ref(false)
const error = ref('')

async function signin() {
    error.value = ''
    loading.value = true
    try {
        const { error } = await client.auth.signInWithPassword({
            email: form.value.email,
            password: form.value.password,
        })

        if (error)
            throw error

        router.push('/')
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
    <Form @submit="signin">
        <h2 class="text-center mb-6 text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold">
            Connexion
        </h2>
        <p
            v-if="error !== ''"
            class="text-red-600 mb-4"
        >
            {{ error }}
        </p>
        <div>
            <div class="text-sm font-bold text-gray-900 tracking-wide">
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
        <div class="mt-8">
            <div class="flex justify-between items-center">
                <div class="text-sm font-bold text-gray-700 tracking-wide">
                    Mot de passe
                </div>
                <div>
                    <NuxtLink
                        to="/oubli-mdp"
                        class="text-xs font-display font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                        Mot de passe oublié
                    </NuxtLink>
                </div>
            </div>
            <Field
                v-model="form.password"
                name="password"
                type="password"
                class="field"
                rules="required"
                placeholder="Mot de passe"
            />
            <ErrorMessage
                name="password"
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
                Connexion
            </button>
        </div>

        <div class="mt-4 text-sm font-display font-semibold text-gray-700 text-center">
            <span>
                Pas de compte ?
                <NuxtLink
                    to="/profil"
                    class="cursor-pointer text-indigo-600 hover:text-indigo-800"
                >
                    Inscription
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
