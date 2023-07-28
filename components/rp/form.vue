<script setup lang="ts">
import { ErrorMessage, Field, Form, configure, defineRule } from 'vee-validate'
import { image, max, min_value, required } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'

interface FormType {
    title: string
    description: string
    illustration?: string
    start_date: string
    roles: {
        name: string
        max_users: number
    }[]
}

const props = defineProps<{
    edit?: boolean | undefined
    form: FormType
    loading: boolean
}>()
const emit = defineEmits<{
    (e: 'input', value: FormType): void
    (e: 'fileChange', value: File): void
    (e: 'submit'): void
}>()
defineRule('required', required)
defineRule('min_value', min_value)
defineRule('image', image)
defineRule('max', max)

configure({
    generateMessage: localize('fr', {
        messages: {
            required: 'Le champ est requis',
            min_value: 'Le nombre ne peut pas être inférieur à 1',
        },
    }),
})

const formProxy = computed({
    get: () => props.form,
    set: value => emit('input', value),
})

const preview = ref('')

function addRole() {
    formProxy.value.roles.push({
        name: '',
        max_users: 1,
    })
}

function removeRole(i: number) {
    formProxy.value.roles.splice(i, 1)
}

const submit = () => emit('submit')

function displayAvatar(e: Event) {
    const files = (e.target as HTMLInputElement).files

    if (files) {
        emit('fileChange', files[0])
        preview.value = URL.createObjectURL(files[0])
    }
}

watch(() => props.form, (value) => {
    preview.value = value.illustration ?? ''
})
</script>

<template>
    <Form @submit="submit">
        <div class="w-full mb-4">
            <label
                for="title"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                Titre
            </label>
            <Field
                id="title"
                v-model="formProxy.title"
                name="title"
                placeholder="Titre du RP"
                type="text"
                rules="required"
                class="input input-bordered w-full"
                required
            />
            <ErrorMessage
                name="title"
                class="text-red-500"
            />
        </div>

        <div class="w-full mb-4">
            <label
                for="start_date"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                Date de début
            </label>
            <Field
                id="start_date"
                v-model="formProxy.start_date"
                name="start_date"
                placeholder="Date de début"
                type="datetime-local"
                class="input input-bordered w-full"
                required
            />
            <ErrorMessage
                name="start_date"
                class="text-red-500"
            />
        </div>

        <div class="w-full mb-4">
            <img
                v-if="preview !== ''"
                :src="preview"
                alt="preview"
                class="w-full rounded-xl mb-2"
            >
            <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                for="user_avatar"
            >
                Illustration
            </label>
            <Field
                name="media"
                accept="image/*"
                class="file-input file-input-bordered w-full"
                type="file"
                rules="image|max:2000"
                @change="displayAvatar"
            />
            <ErrorMessage
                name="media"
                class="text-red-500"
            />
        </div>

        <div class="w-full mb-4">
            <label
                for="description"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                Description
            </label>
            <textarea
                id="description"
                v-model="formProxy.description"
                rows="8"
                class="textarea textarea-bordered w-full"
                placeholder="Description du rp"
            />
        </div>
        <div
            v-if="!edit"
            class="w-full mb-4"
        >
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Rôles
            </label>

            <div
                v-for="(role, i) in form.roles"
                :key="i"
                class="grid grid-cols-4 gap-4 mb-2"
            >
                <div class="col-span-2">
                    <Field
                        v-model="role.name"
                        :name="`name_${i}`"
                        placeholder="Nom du rôle"
                        type="text"
                        rules="required"
                        class="input input-bordered w-full"
                        required
                    />
                    <ErrorMessage
                        :name="`name_${i}`"
                        class="text-red-500"
                    />
                </div>
                <div class="col-start-3">
                    <Field
                        v-model="role.max_users"
                        :name="`max_users_${i}`"
                        type="number"
                        rules="required|min_value:1"
                        class="input input-bordered w-full"
                        required
                    />
                    <ErrorMessage
                        :name="`max_users_${i}`"
                        class="text-red-500"
                    />
                </div>
                <div class="col-start-4 flex justify-end">
                    <button
                        class="btn btn-error"
                        @click.prevent="removeRole(i)"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
            <div class="mt-4">
                <button
                    class="btn btn-info"
                    @click.prevent="addRole()"
                >
                    Ajouter un rôle
                </button>
            </div>
        </div>
        <div class="mb-4 flex justify-end">
            <button
                class="btn btn-primary"
                :disabled="loading"
            >
                <span
                    v-if="loading"
                    class="loading loading-spinner"
                />
                Enregistrer
            </button>
        </div>
    </Form>
</template>

<style scoped>
input,
textarea {
    @apply text-gray-900 dark:text-gray-100
}
</style>
