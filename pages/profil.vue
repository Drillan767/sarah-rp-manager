<template>
    <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Informations du profil</h2>
            <form @submit.prevent="submit">
                <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div class="w-full">
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Adresse email
                        </label>
                        <input type="email" v-model="form.email" id="email" class="input" placeholder="sarah@gmail.com"
                            required>
                    </div>
                    <div class="w-full">
                        <label for="pseudo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Pseudo
                        </label>
                        <input type="text" v-model="form.username" id="pseudo" class="input" placeholder="Sarah"
                            required>
                    </div>
                    <div class="sm:col-span-2">
                        <img v-if="preview !== ''" :src="preview" alt="preview" class="w-full rounded-xl">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">
                            Avatar
                        </label>
                        <input @change="displayAvatar" class="file-input" aria-describedby="user_avatar_help" id="user_avatar" type="file">

                    </div>
                    <div class="w-full">
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Nouveau mot de passe
                        </label>
                        <input type="password" v-model="form.email" id="password" class="input" placeholder="Mot de passe"
                            required>
                    </div>
                    <div class="w-full">
                        <label for="passwordRepeat" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Répéter le nouveau mot de passe
                        </label>
                        <input type="password" v-model="form.email" id="passwordRepeat" class="input" placeholder="Répéter le mot de passe"
                            required>
                    </div>
                    <div class="sm:col-span-2">
                        <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Description
                        </label>
                        <textarea id="description" rows="8" class="textarea" placeholder="Your description here"></textarea>
                    </div>
                </div>
                <button type="submit" class="button-primary">
                    Enregistrer
                </button>
            </form>
        </div>
    </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const breadcrumb = useBreadcrumbStore()
// const breadcrumb = useBreadcrumbStore()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const userData = await supabase
    .from('users')
    .select(`username`)
    .eq('session_id', user.value?.id)
    .single()

// const { links } = storeToRefs(breadcrumb)

/* 
links.value = [
    {
        title: 'Accueil',
        url: '/'
    },
    {
        title: 'Profil'
    }
] */

useHead({
    title: 'Profil',
})

const preview = ref('')

const displayAvatar = (e: Event) => {
    let files = (e.target as HTMLInputElement).files

    if (files) {
        preview.value = URL.createObjectURL(files[0])
    }
    console.log(file)

}

const file = ref(null)
const form = reactive({
    email: '',
    username: '',
    password: '',
    passwordRepeat: '',
    description: '',
})

const submit = () => {

}


</script>