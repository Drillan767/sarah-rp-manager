<template>
    <form @submit.prevent="submit">
        <h2
            class="text-center text-4xl mb-6 text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold">
            Nouveau mot de passe
        </h2>
        <p v-if="success" class="bg-green-400 p-2 mb-4 text-white">
            Mot de passe mit à jour
        </p>
        <div>
            <div class="text-sm font-bold text-gray-700 tracking-wide">Nouveau mot de passe</div>
            <input v-model="password"
                class="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" type="email"
                placeholder="mike@gmail.com">
        </div>

        <div>
            <div class="text-sm font-bold text-gray-700 tracking-wide">Nouveau mot de passe</div>
            <input v-model="confirmPassword"
                class="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" type="email"
                placeholder="mike@gmail.com">
        </div>

        <div class="mt-10">
            <button class="btn" :disabled="canSubmit">
                Enregistrer
            </button>
        </div>

        <div class="mt-4 text-sm font-display font-semibold text-gray-700 text-center">
            <NuxtLink to="/connexion" class="cursor-pointer text-indigo-600 hover:text-indigo-800">
                Inscription
            </NuxtLink>
        </div>
    </form>
</template>

<script setup>
const client = useSupabaseAuthClient()

useHead({
    title: 'Mot de passe oublié'
})

const success = ref(false)
const password = ref('');
const confirmPassword = ref('')

const canSubmit = computed(() => {
    return password.value.length > 6
        && confirmPassword.value.length > 6
        && password.value === confirmPassword.value
})

const submit = async () => {
    await client.auth.updateUser({ password: password.value });
    success.value = true;
}

</script>

<style scoped lang="scss">
    .btn {
        @apply bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold shadow-lg;

        &:focus {
            @apply outline-none;
        }

        &:disabled {
            @apply bg-slate-50 text-slate-500 border-slate-200 shadow-none;
        }

        &:hover {
            @apply bg-indigo-600;
        }
    }
</style>