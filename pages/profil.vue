<template>
    <section>
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            <h2 v-if="isCreatingProfile" class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Nouveau profil</h2>
            <h2 v-else class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Informations du profil</h2>
            <Form @submit="submit">
                <div class="alert alert-success mb-4" v-if="success">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span v-if="isCreatingProfile">Un email vous a été envoyé, veuillez cliquer sur le lien pour activer
                        votre compte.</span>
                    <span v-else>Informations sauvegardées.</span>
                </div>

                <div class="alert alert-error mb-4" v-if="error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none"
                        viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        Un erreur est survenue:<br />
                        {errorMessage}
                    </span>
                </div>

                <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div class="w-full">
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Adresse email
                        </label>
                        <Field v-model="form.email" name="email" type="email" rules="email|required" id="email"
                            placeholder="sarah@gmail.com" class="input input-bordered w-full" required
                            :disabled="!isCreatingProfile" />
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
                    <div v-if="isCreatingProfile" class="w-full">
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Mot de passe
                        </label>
                        <Field v-model="form.password" name="password" type="password" rules="password|required"
                            id="password" class="input input-bordered w-full" ref="password" required />
                        <ErrorMessage name="password" class="text-red-500" />
                    </div>
                    <div v-if="isCreatingProfile" class="w-full">
                        <label for="confirm_password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Confirmation mot de passe
                        </label>
                        <Field v-model="form.confirm_password" name="confirm_password" type="password"
                            rules="confirmed:@password|required" id="confirm_password" class="input input-bordered w-full"
                            required />
                        <ErrorMessage name="confirm_password" class="text-red-500" />
                    </div>
                    <div class="sm:col-span-2" v-if="!isCreatingProfile">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Avatar
                        </label>
                        <div class="flex justify-evenly items-center">
                            <div v-if="(form.image_url && form.image_url !== '') || preview !== ''" class="avatar">
                                <div class="w-20 rounded-full">
                                    <img v-if="preview !== ''" :src="preview">
                                    <img :src="form.image_url" />
                                </div>
                            </div>
                            <Field name="media" accept="image/*" class="file-input file-input-bordered w-auto" type="file"
                                rules="image|max:2000" @change="displayAvatar" />
                            <ErrorMessage name="media" class="text-red-500" />
                        </div>
                    </div>

                    <div class="sm:col-span-2">
                        <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Description
                        </label>
                        <textarea v-model="form.description" id="description" rows="8"
                            class="textarea textarea-bordered w-full" placeholder="Description du personnage"></textarea>
                    </div>

                    <Availability
                        v-if="form.availability"
                        :form="form.availability"
                    />
                </div>

                <div v-if="isCreatingProfile" class="flex justify-end gap-x-4 mt-8">
                    <button class="btn btn-primary" type="submit" :disabled="loading">
                        <span v-if="loading" class="loading loading-spinner"></span>
                        Créer le profil
                    </button>
                </div>
                <div v-else class="flex justify-end gap-x-4 mt-8">
                    <button @click.prevent="editPassword" class="btn btn-warning" :disabled="loading">Modifier le mot de
                        passe</button>
                    <button class="btn btn-primary" type="submit" :disabled="loading">
                        <span v-if="loading" class="loading loading-spinner"></span>
                        Enregistrer les modifications
                    </button>
                </div>
            </Form>
        </div>

        <ChangePasswordModal :show="showPasswordModal" @close="showPasswordModal = false" @success="passwordChanged" />
    </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { image, required, email, max, confirmed } from '@vee-validate/rules'
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { localize } from '@vee-validate/i18n'
import Availability from '@/components/profile/Availability.vue'
import ChangePasswordModal from '@/components/modal/ChangePasswordModal.vue'
import { useUserStore } from '@/stores/users'

const userStore = useUserStore()
const { updateProfile } = userStore
const { user } = storeToRefs(userStore)

const isCreatingProfile = computed(() => Object.keys(user.value).length === 0 && user.value.constructor === Object);

useHead({
    title: isCreatingProfile.value ? 'Inscription' : 'Edition profil',
})

defineRule('email', email)
defineRule('required', required)
defineRule('image', image)
defineRule('max', max)
defineRule('password', (value: string) => { return value && value.length >= 6 })
defineRule('confirmed', confirmed)

configure({
    generateMessage: localize('fr', {
        messages: {
            required: 'Le champ est requis',
            email: 'Format d\'email non valide',
            image: 'Veuillez sélectionner une image',
            max: 'Le fichier ne doit pas faire plus de 2 mo',
            password: 'Le mot de passe doit faire 6 caractères minimum',
            confirm_password: 'Les mots de passe ne correspondent pas'
        },
    }),
})

const loading = ref(false)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')
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

const form = ref<any>({
    email: '',
    username: '',
    description: '',
})

const submit = async () => {
    loading.value = true
    success.value = false
    errorMessage.value = ''

    const formData = new FormData()

    formData.append('email', form.value.email)
    formData.append('username', form.value.username)

    if (isCreatingProfile.value) {
        formData.append('password', form.value.password)
    } else {
        formData.append('session_id', user.value.session_id)
        formData.append('availability', JSON.stringify(form.value.availability))
    }

    formData.append('description', form.value.description)

    if (file.value) {
        formData.append('media', file.value)
    }

    if (isCreatingProfile.value) {
        await useFetch('/api/profile/register', {
            method: 'POST',
            body: formData
        })
    } else {
        await updateProfile(formData)
    }

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
    if (isCreatingProfile.value) {
        form.value.password = ''
        form.value.confirm_password = ''
    } else {
        const { email, username, image_url, description, availability } = user.value
        form.value = Object.assign(form.value, {
            email,
            username,
            image_url,
            description,
            availability, 
        })
    }
})
</script>

<style scoped>
input,
textarea {
    @apply text-gray-900 dark:text-gray-100
}</style>