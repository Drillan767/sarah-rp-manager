<template>
    <section>
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Informations du profil</h2>
            <Form @submit="submit">
                <div class="alert alert-success mb-4" v-if="success">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Informations sauvegardées</span>
                </div>
                <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div class="w-full">
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Adresse email
                        </label>
                        <Field v-model="form.email" name="email" type="email" rules="email|required" id="email"
                            placeholder="sarah@gmail.com" class="input input-bordered w-full" required />
                        <ErrorMessage name="email" class="text-red-500" />
                    </div>
                    <div class="w-full">
                        <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Pseudo
                        </label>
                        <Field v-model="form.username" name="username" type="text" rules="required" id="username"
                            placeholder="Sarah" class="input input-bordered w-full" required />
                        <ErrorMessage name="username" class="text-red-500" />
                    </div>
                    <div class="sm:col-span-2">
                        <img v-if="preview !== ''" :src="preview" alt="preview" class="w-full rounded-xl mb-2">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">
                            Avatar
                        </label>
                        <Field
                            name="media"
                            accept="image/*"
                            class="file-input file-input-bordered w-full"
                            type="file"
                            rules="image|max:2000"
                            @change="displayAvatar"
                        />
                        <ErrorMessage name="media" class="text-red-500" />

                    </div>

                    <div class="sm:col-span-2">
                        <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Description
                        </label>
                        <textarea v-model="form.description" id="description" rows="8"
                            class="textarea textarea-bordered w-full" placeholder="Description du personnage"></textarea>
                    </div>
                </div>

                <Availabilities
                    v-model="form.availability"
                />

                <div class="flex justify-end gap-x-4 mt-4">
                    <button @click.prevent="editPassword" class="btn btn-warning" :disabled="loading">Modifier le mot de
                        passe</button>
                    <button class="btn btn-primary" type="submit" :disabled="loading">
                        <span v-if="loading" class="loading loading-spinner"></span>
                        Enregistrer
                    </button>
                </div>
            </Form>
        </div>

        <ChangePasswordModal
            :show="showPasswordModal"
            @close="showPasswordModal = false"
            @success="passwordChanged"
        />
    </section>
</template>

<script setup lang="ts">
import type { User } from 'types'
import { storeToRefs } from 'pinia'
import { image, required, email, max } from '@vee-validate/rules'
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { localize } from '@vee-validate/i18n'
import ChangePasswordModal from '@/components/modal/ChangePasswordModal.vue'
import Availabilities from '@/components/Availabilities.vue'
import { useUserStore } from '@/stores/users'

useHead({
    title: 'Profil',
})

const defaultAvailabilities: User['availability'] = {
    Lundi: [],
    Mardi: [],
    Mercredi: [],
    Jeudi: [],
    Vendredi: [],
    Samedi: [],
    Dimanche: [],
}

const userStore = useUserStore()
const { updateProfile } = userStore
const { user } = storeToRefs(userStore)

defineRule('email', email)
defineRule('required', required)
defineRule('image', image)
defineRule('max', max)

configure({
    generateMessage: localize('fr', {
        messages: {
            required: 'Le champ est requis',
            email: 'Format d\'email non valide',
            image: 'Veuillez sélectionner une image',
            max: 'Le fichier ne doit pas faire plus de 2 mo'
        },
    }),
})

const loading = ref(false)
const success = ref(false)
const showPasswordModal = ref(false)
const preview = ref('')

const displayAvatar = (e: Event) => {
    let files = (e.target as HTMLInputElement).files

    if (files) {
        file.value = files[0]
        preview.value = URL.createObjectURL(files[0])
    }
}

const file = ref<File | null>(null)

const form = ref({
    email: '',
    username: '',
    description: '',
    availability: defaultAvailabilities,
})

const submit = async () => {
    loading.value = true
    const formData = new FormData()
    formData.append('session_id', user.value.session_id)
    formData.append('email', form.value.email)
    formData.append('username', form.value.username)
    formData.append('description', form.value.description)
    formData.append('availability', JSON.stringify(form.value.availability))

    if (file.value) {
        formData.append('media', file.value)
    }

    await updateProfile(formData)
    success.value = true
    loading.value = false
}

const editPassword = () => {
    showPasswordModal.value = !showPasswordModal.value
}

const passwordChanged = () => {
    showPasswordModal.value = false
    success.value = true
}

onMounted(() => {
    form.value = Object.assign({}, user.value)
})

</script>

<style scoped>
input,
textarea {
    @apply text-gray-900 dark:text-gray-100
}
</style>