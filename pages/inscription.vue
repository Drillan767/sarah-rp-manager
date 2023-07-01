<template>
    <form @submit.prevent="submit">
        <h2 class="text-center text-4xl mb-6 text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold">
            Inscription
        </h2>
        <p v-if="error !== ''" class="bg-red-400 p-2 mb-4 text-white">
            {{ error }}
        </p>
        <p v-if="success" class="bg-green-400 p-2 mb-4 text-white">
            Un email vous a été envoyé, veuillez cliquer sur le lien pour activer votre compte.
        </p>
        <div>
            <div class="text-sm font-bold text-gray-700 tracking-wide">Adresse email</div>
            <input v-model="email"
                class="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" type="email"
                placeholder="mike@gmail.com">
        </div>
        <div class="mt-8">
            <div class="flex justify-between items-center">
                <div class="text-sm font-bold text-gray-700 tracking-wide">
                    Mot de passe
                </div>
            </div>
            <input v-model="password"
                class="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                type="password" placeholder="Mot de passe">
        </div>
        <div class="mt-8">
            <div class="flex justify-between items-center">
                <div class="text-sm font-bold text-gray-700 tracking-wide">
                    Répéter le mot de passe
                </div>
            </div>
            <input v-model="repeatPassword"
                class="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                type="password" placeholder="Mot de passe">
        </div>
        <div class="mt-10">
            <button class="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide
                                font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                                shadow-lg" :disabled="!canSubmit">
                Inscription
            </button>
        </div>

        <div class="mt-4 text-sm font-display font-semibold text-gray-700 text-center">
            <NuxtLink to="/connexion" class="cursor-pointer text-indigo-600 hover:text-indigo-800">
                Connexion
            </NuxtLink>
        </div>
    </form>
</template>

<script setup>

useHead({
    title: 'Inscription'
})

const router = useRouter();
const supabase = useSupabaseAuthClient()

const error = ref('');
const email = ref('');
const password = ref('');
const repeatPassword = ref('');
const success = ref(false);

const canSubmit = computed(() => {
    return password.value.length >= 6
        && repeatPassword.value.length >= 6
        && email.value.length > 0
        && password.value === repeatPassword.value
})

const submit = async () => {
    error.value = '';
    const regex = new RegExp('');
    if (/^([_a-z0-9]+[\._a-z0-9]*)(\+[a-z0-9]+)?@(([a-z0-9-]+\.)*[a-z]{2,4})$/.test(email.value)) {
        await supabase.auth.signUp({
            email: email.value,
            password: password.value,
        })
        success.value = true;
    } else {
        error.value = `Format d'email incorrect`
    }
    // ^([_a-z0-9]+[\._a-z0-9]*)(\+[a-z0-9]+)?@(([a-z0-9-]+\.)*[a-z]{2,4})$
    /*  const { data, error } = await supabase.auth.signUp({
         email: email.value,
         password: password.value,
     }) */
    // console.log(data);
    console.log('submitted');
}

</script>