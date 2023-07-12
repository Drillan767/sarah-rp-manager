<template>
    <Form @submit="submit">
        <div class="alert alert-success mb-4" v-if="success">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Informations sauvegardées</span>
        </div>
        <div class="w-full mb-4">
            <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Titre
            </label>
            <Field v-model="form.title" name="title" placeholder="Titre du RP" type="text" rules="required" id="title"
                class="input input-bordered w-full" required />
            <ErrorMessage name="title" class="text-red-500" />
        </div>

        <div class="w-full mb-4">
            <label for="start_date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Date de début
            </label>
            <Field v-model="form.start_date" name="start_date" placeholder="Date de début" type="date" rules="required" id="start_date"
                class="input input-bordered w-full" required />
            <ErrorMessage name="start_date" class="text-red-500" />
        </div>

        <div class="w-full mb-4">
            <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Description
            </label>
            <textarea v-model="form.description" id="description" rows="8" class="textarea textarea-bordered w-full"
                placeholder="Description du rp" />
        </div>
        <div class="w-full mb-4">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Rôles
            </label>

            <div v-for="(role, i) in form.roles" class="grid grid-cols-4 gap-4 mb-2" :key="i">
                <div class="col-span-2">
                    <Field v-model="role.name" :name="`name_${i}`" placeholder="Nom du rôle" type="text" rules="required"
                        class="input input-bordered w-full" required />
                    <ErrorMessage :name="`name_${i}`" class="text-red-500" />
                </div>
                <div class="col-start-3">
                    <Field v-model="role.max_users" :name="`max_users_${i}`" type="number" rules="required|min_value:1"
                        class="input input-bordered w-full" required />
                    <ErrorMessage :name="`max_users_${i}`" class="text-red-500" />
                </div>
                <div class="col-start-4 flex justify-end">
                    <button @click.prevent="removeRole(i)" class="btn btn-error">
                        Supprimer
                    </button>
                </div>
            </div>
            <div class="mt-4">
                <button @click.prevent="addRole()" class="btn btn-info">
                    Ajouter un rôle
                </button>
            </div>
        </div>
        <div class="mb-4 flex justify-end">
            <button class="btn btn-primary">
                Enregistrer
            </button>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { required, min_value } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'

defineRule('required', required)
defineRule('min_value', min_value)

configure({
    generateMessage: localize('fr', {
        messages: {
            required: 'Le champ est requis',
            min_value: 'Le nombre ne peut pas être inférieur à 1'
        },
    }),
})

const form = ref({
    title: '',
    description: '',
    start_date: '',
    roles: [
        {
            name: '',
            max_users: 1,
        }
    ]
})

const success = ref(false)

const addRole = () => {
    form.value.roles.push({
        name: '',
        max_users: 1,
    })
}

const removeRole = (i: number) => {
    form.value.roles.splice(i, 1)
}


const submit = async () => {
    await useFetch('/api/rp/store', {
        method: 'POST',
        body: form.value
    })

    success.value = true
}

</script>