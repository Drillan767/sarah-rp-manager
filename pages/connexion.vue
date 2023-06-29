<template>
    <AuthLayout>
        <template #title>
            Connexion
        </template>
        <template #form>
            <form @submit.prevent="login">
                <p v-if="error !== ''" class="text-red-600 mb-4">
                    {{ error }}
                </p>
                <div>
                    <div class="text-sm font-bold text-gray-700 tracking-wide">Adresse email</div>
                    <input v-model="email" class="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                        type="email" placeholder="mike@gmail.com">
                </div>
                <div class="mt-8">
                    <div class="flex justify-between items-center">
                        <div class="text-sm font-bold text-gray-700 tracking-wide">
                            Mot de passe
                        </div>
                        <div>
                            <a class="text-xs font-display font-semibold text-indigo-600 hover:text-indigo-800
                                        cursor-pointer">
                                Mot de passe oublié ?
                            </a>
                        </div>
                    </div>
                    <input v-model="password" class="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                        type="password" placeholder="Mot de passe">
                </div>
                <div class="mt-10">
                    <button class="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide
                                font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                shadow-lg">
                        Connexion
                    </button>
                </div>

                <div class="mt-12 text-sm font-display font-semibold text-gray-700 text-center">
                    Pas de compte ? <a class="cursor-pointer text-indigo-600 hover:text-indigo-800" href="/inscription">Inscription</a>
                </div>
            </form>
        </template>
    </AuthLayout>
</template>

<script setup>
import AuthLayout from './AuthLayout.vue'

useHead({
    title: 'Connexion'
})

const router = useRouter()
const supabase = useSupabaseAuthClient()

const email = ref('');
const password = ref('');
const error = ref('');

/* const config = useRuntimeConfig();

console.log(config.public.supabaseURl, config.public.supabaseKey);

const supabase = createClient(config.public.supabaseURl, config.public.supabaseKey) */

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