<template>
    <Form @submit="signin">
        <h2 class="text-center mb-6 text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold">
            Connexion
        </h2>
        <p v-if="error !== ''" class="text-red-600 mb-4">
            {{ error }}
        </p>
        <div>
            <div class="text-sm font-bold text-gray-900 tracking-wide">Adresse email</div>
            <Field
                name="email"
                type="email"
                class="field"
                rules="email|required"
                v-model="form.email"
                placeholder="sarah@gmail.com"
            />
            <ErrorMessage name="email" class="text-red-500" />
        </div>
        <div class="mt-8">
            <div class="flex justify-between items-center">
                <div class="text-sm font-bold text-gray-700 tracking-wide">
                    Mot de passe
                </div>
                <div>
                    <NuxtLink to="/oubli-mdp" class="text-xs font-display font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer" >
                        Mot de passe oublié
                    </NuxtLink>
                </div>
            </div>
            <Field
                name="password"
                type="password"
                class="field"
                rules="required"
                v-model="form.password"
                placeholder="Mot de passe"
            />
            <ErrorMessage name="password" class="text-red-500" />
        </div>
        <div class="mt-10 flex justify-center">
            <button class="btn-primary btn btn-wide">
                Connexion
            </button>
        </div>

        <div class="mt-4 text-sm font-display font-semibold text-gray-700 text-center">
            <span>
                Pas de compte ? 
                <NuxtLink to="/inscription" class="cursor-pointer text-indigo-600 hover:text-indigo-800">
                    Inscription
                </NuxtLink>
            </span>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/users';
import { required, email } from '@vee-validate/rules'
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { localize } from '@vee-validate/i18n'

useHead({
    title: 'Connexion'
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

const userStore = useUserStore()

const form = ref({
    email: '',
    password: '',
})


const error = ref('');

const { login } = userStore

const signin = async () => {
    const errorMessage = await login(
        form.value.email,
        form.value.password
    )

    if (errorMessage) {
        error.value = errorMessage
    }
}

</script>

<style scoped>

.field {
    @apply w-full text-lg py-2 border-b text-gray-700 border-gray-300 focus:outline-none focus:border-indigo-500 bg-white;
}
</style>