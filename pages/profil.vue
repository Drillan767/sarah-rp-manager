<template>
    <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Informations du profil</h2>
            <Form @submit.prevent="submit">
                <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div class="w-full">
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Adresse email
                        </label>
                        <Field name="email" type="email" rules="email|required" id="email"
                            placeholder="sarah@gmail.com" class="input" required />
                        <ErrorMessage name="email" class="text-red-500" />
                    </div>
                    <div class="w-full">
                        <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Pseudo
                        </label>
                        <Field name="username" type="text" rules="required" id="username"
                            placeholder="Sarah" class="input" required />
                        <ErrorMessage name="username" class="text-red-500" />
                    </div>
                    <div class="sm:col-span-2">
                        <img v-if="preview !== ''" :src="preview" alt="preview" class="w-full rounded-xl mb-2">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">
                            Avatar
                        </label>
                        <Field name="media" v-slot="{ handleChange }" rules="image|max:2000">
                            <input @change="handleChange" class="file-input" aria-describedby="user_avatar_help"
                            id="user_avatar" type="file">
                        </Field>
                        <ErrorMessage name="media" class="text-red-500" />

                    </div>

                    <div class="sm:col-span-2">
                        <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Description
                        </label>
                        <textarea v-model="form.description" id="description" rows="8" class="textarea"
                            placeholder="Your description here"></textarea>
                    </div>
                </div>
                <div class="flex justify-end gap-x-4 mt-4">
                    <Button @click="editPassword" color="yellow">Modifier le mot de passe</Button>
                    <Button color="default" type="submit">Enregistrer</Button>
                </div>
            </Form>
        </div>

        <ChangePasswordModal />
    </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { image, required, email, max } from '@vee-validate/rules'
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { localize } from '@vee-validate/i18n'
import ChangePasswordModal from '@/components/modal/ChangePasswordModal.vue'
import { useBreadcrumbStore } from '@/stores/breadcrumb'

useHead({
    title: 'Profil',
})

const breadcrumb = useBreadcrumbStore()
const { links } = storeToRefs(breadcrumb)

links.value = [
    {
        title: 'Accueil',
        url: '/'
    },
    {
        title: 'Profil'
    }
]

defineRule('email', email)
defineRule('required', required)
defineRule('image', image)
defineRule('max', max)

configure({
  generateMessage: localize('fr'),
});

const preview = ref('')

const displayAvatar = (e: Event) => {
    let files = (e.target as HTMLInputElement).files

    if (files) {
        file.value = files[0]
        preview.value = URL.createObjectURL(files[0])
    }
    console.log(file)
}

const file = ref<File | null>(null)
const form = reactive({
    email: '',
    username: '',
    password: '',
    passwordRepeat: '',
    description: '',
})

const submit = async () => {
    const formData = new FormData()
    formData.append('email', form.email)
    formData.append('username', form.username)
    formData.append('password', form.password)
    formData.append('passwordRepeat', form.passwordRepeat)
    formData.append('description', form.description)

    if (file.value) {
        formData.append('media', file.value)
    }

    await useFetch('/api/profile/update', {
        method: 'POST',
        body: formData
    })
    console.log(form)
}

const editPassword = () => {
    console.log('ui bjr')
}

</script>
