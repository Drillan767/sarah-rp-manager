<script setup lang="ts">
import type { Database } from 'types/supabase'
import { email, image, max, required } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import { Field, Form, configure, defineRule } from 'vee-validate'
import type { ProfileFormType } from '@/types'
import Availability from '@/components/profile/Availability.vue'
import ChangePasswordModal from '@/components/modal/ChangePasswordModal.vue'
import { useCurrentUser } from '@/composables/currentUser'

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
            max: 'Le fichier ne doit pas faire plus de 2 mo',
            password: 'Le mot de passe doit faire 6 caractères minimum',
            confirm_password: 'Les mots de passe ne correspondent pas',
        },
    }),
})

useHead({
    title: 'Profil',
})

const defaultAvatar = 'https://sarah-rp-manager.vercel.app/default-avatar.webp'

const supabase = useSupabaseClient<Database>()
const session = useSupabaseUser()
const currentUser = useCurrentUser()
const showPasswordModal = ref(false)
const preview = ref('')
const file = ref<File | null>(null)
const loading = ref(false)
const success = ref(false)

const form = ref<ProfileFormType>({
    email: '',
    username: '',
    description: '',
    availability: {
        weekdays: false,
        weekends: false,
        available: [],
        unavailble: [],
    },
})

function displayAvatar(e: Event) {
    const files = (e.target as HTMLInputElement).files

    if (files) {
        file.value = files[0]
        preview.value = URL.createObjectURL(files[0])
    }
}

function editPassword() {
    showPasswordModal.value = !showPasswordModal.value
}

onMounted(async () => {
    const { data: userData } = await supabase
        .from('users')
        .select('email, username, availability, image_url, description')
        .eq('session_id', session.value!.id)
        .single()

    if (userData) {
        form.value.email = userData.email
        form.value.username = userData.username
        form.value.description = userData.description ?? ''
        form.value.availability = userData.availability

        preview.value = userData.image_url ?? defaultAvatar
    }
})

function passwordChanged() {
    showPasswordModal.value = false
    success.value = true
}

async function submit() {
    loading.value = true
    success.value = false

    const formData = new FormData()
    formData.append('email', form.value.email)
    formData.append('username', form.value.username)
    formData.append('session_id', session.value!.id)
    formData.append('availability', JSON.stringify(form.value.availability))

    formData.append('description', form.value.description)

    if (file.value)
        formData.append('media', file.value)

    const { data } = await useFetch('/api/profile/update', {
        method: 'POST',
        body: formData,
    })

    currentUser.value.username = form.value.username
    if (data.value && data.value.payload.image_url)
        currentUser.value.image_url = data.value.payload.image_url

    success.value = true
    loading.value = false
}
</script>

<template>
    <section>
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            <h2
                class="mb-4 text-xl font-bold text-gray-900 dark:text-white"
            >
                Informations du profil
            </h2>
            <Form @submit="submit">
                <div
                    v-if="success"
                    class="alert alert-success mb-4"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>Informations sauvegardées.</span>
                </div>
                <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div>
                        <label
                            for="email"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Adresse email
                        </label>
                        <Field
                            id="email"
                            v-model="form.email"
                            name="email"
                            type="email"
                            rules="email|required"
                            placeholder="sarah@gmail.com"
                            class="input input-bordered w-full"
                            disabled
                        />
                    </div>
                    <div>
                        <label
                            for="username"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Pseudo
                        </label>
                        <Field
                            id="username"
                            v-model="form.username"
                            name="username"
                            type="text"
                            rules="required"
                            placeholder="Sarah"
                            class="input input-bordered w-full"
                            required
                        />
                        <ErrorMessage
                            name="username"
                            class="text-red-500"
                        />
                    </div>
                    <div
                        class="sm:col-span-2"
                    >
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Avatar
                        </label>
                        <div class="flex justify-evenly items-center">
                            <div
                                v-if="preview !== ''"
                                class="avatar"
                            >
                                <div class="w-20 rounded-full">
                                    <img :src="preview">
                                </div>
                            </div>
                            <Field
                                name="media"
                                accept="image/*"
                                class="file-input file-input-bordered w-auto"
                                type="file"
                                rules="image|max:2000"
                                @change="displayAvatar"
                            />
                            <ErrorMessage
                                name="media"
                                class="text-red-500"
                            />
                        </div>
                    </div>
                    <div class="sm:col-span-2">
                        <label
                            for="description"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            v-model="form.description"
                            rows="8"
                            class="textarea textarea-bordered w-full"
                            placeholder="Description du personnage"
                        />
                    </div>
                    <Availability
                        :form="form.availability"
                    />
                </div>

                <div
                    class="flex justify-end gap-x-4 mt-8"
                >
                    <button
                        class="btn btn-warning"
                        :disabled="loading"
                        @click.prevent="editPassword"
                    >
                        Modifier le mot de
                        passe
                    </button>
                    <button
                        class="btn btn-primary"
                        type="submit"
                        :disabled="loading"
                    >
                        <span
                            v-if="loading"
                            class="loading loading-spinner"
                        />
                        Enregistrer les modifications
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
