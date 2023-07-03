<template>
    <form @submit.prevent="submit">
        <h2
            class="text-center text-4xl mb-6 text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold">
            Oubli du mot de passe
        </h2>
        <p v-if="success" class="bg-green-400 p-2 mb-4 text-white">
            Un email vous permettantde modifier votre mot de passe a été envoyé à l'adresse email indiquée.
        </p>
        <div>
            <div class="text-sm font-bold text-gray-700 tracking-wide">Adresse email</div>
            <input v-model="email"
                class="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" type="email"
                placeholder="mike@gmail.com">
        </div>

        <div class="mt-10">
            <button class="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide
                                font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                                shadow-lg">
                Réinitialiser le mot de passe
            </button>
        </div>

        <div class="mt-4 text-sm font-display font-semibold text-gray-700 text-center">
            <NuxtLink to="/connexion" class="cursor-pointer text-indigo-600 hover:text-indigo-800">
                Inscription
            </NuxtLink>
        </div>
    </form>
</template>

<script setup lang="ts">
const client = useSupabaseAuthClient()

useHead({
    title: 'Mot de passe oublié'
})

const success = ref(false)
const email = ref('');

const submit = async() => {
    await client.auth.resetPasswordForEmail(email.value, {
        redirectTo: 'https://sarah-rp-manager.vercel.app/nouveau-mdp'
    });

    email.value = '';

    success.value = true;

}

</script>