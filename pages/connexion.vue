<template>
    <form @submit.prevent="login">
        <h2 class="text-center mb-6 text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold">
            Connexion
        </h2>
        <p v-if="error !== ''" class="text-red-600 mb-4">
            {{ error }}
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
                <div>
                    <NuxtLink to="/oubli-mdp" class="text-xs font-display font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer" >
                        Mot de passe oublié
                    </NuxtLink>
                </div>
            </div>
            <input v-model="password"
                class="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                type="password" placeholder="Mot de passe">
        </div>
        <div class="mt-10">
            <button class="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide
                                font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                shadow-lg">
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

useHead({
    title: 'Connexion'
})

const router = useRouter()
const supabase = useSupabaseAuthClient()

const email = ref('');
const password = ref('');
const error = ref('');

const login = async () => {
    const { data, error: errResponse } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    })

    router.push('/')

    if (errResponse) {
        error.value = errResponse.message
        console.log({ error })
    }
}

const logout = () => {
    supabase.auth.signOut();
}

</script>
