<template>
    <form @submit.prevent="signin">
        <h2 class="text-center mb-6 text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold">
            Connexion
        </h2>
        <p v-if="error !== ''" class="text-red-600 mb-4">
            {{ error }}
        </p>
        <div>
            <div class="text-sm font-bold text-gray-900 tracking-wide">Adresse email</div>
            <input v-model="email"
                class="w-full text-lg py-2 border-b text-gray-700 border-gray-300 focus:outline-none focus:border-indigo-500 bg-white" type="email"
                placeholder="mike@gmail.com">
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
            <input v-model="password"
                class=" bg-white w-full text-lg py-2 border-b text-gray-700 border-gray-300 focus:outline-none focus:border-indigo-500"
                type="password" placeholder="Mot de passe">
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
    </form>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/users';

useHead({
    title: 'Connexion'
})

const userStore = useUserStore()

const email = ref('');
const password = ref('');
const error = ref('');

const { login } = userStore

const signin = async () => {
    const errorMessage = await login(email.value, password.value)
    if (errorMessage) {
        error.value = errorMessage
    }
}


</script>
