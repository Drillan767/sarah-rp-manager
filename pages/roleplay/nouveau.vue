<template>
    <div>
        <button @click="router.back()" class="mb-4 btn btn-primary">
            <ArrowLeftIcon class="w-4 h-4" />
            Retour
        </button>
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Nouveau RP</h2>
            <Form
                :form="form"
                @fileChange="fileChange"
                @submit="submit"
                :loading="loading"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/users';
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
import Form from '@/components/rp/form.vue'

useHead({
    title: 'Nouveau RP'
})

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const router = useRouter()

const file = ref<File | null>(null)
const loading = ref(false)

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

const fileChange = (newFile: File) => {
    file.value = newFile
}

const submit = async () => {
    loading.value = true
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('description', form.value.description)
    formData.append('start_date', form.value.start_date)
    formData.append('roles', JSON.stringify(form.value.roles))

    if (file.value) {
        formData.append('illustration', file.value)
    }

    const { data, error } = await useFetch('/api/rp/store', {
        method: 'POST',
        body: formData
    })

    loading.value = false

    if (error.value) {
        console.log(error.value.message)
    }

    if (data.value) {
        router.push(`/roleplay/${data.value.id}?created=1`)
    }
}
</script>