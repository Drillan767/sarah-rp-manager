<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
import Form from '@/components/rp/form.vue'

useHead({
    title: 'Nouveau RP',
})

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
        },
    ],
})

function fileChange(newFile: File) {
    file.value = newFile
}

async function submit() {
    loading.value = true
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('description', form.value.description)
    formData.append('start_date', form.value.start_date)
    formData.append('roles', JSON.stringify(form.value.roles))

    if (file.value)
        formData.append('illustration', file.value)

    const { data } = await useFetch('/api/rp/store', {
        method: 'POST',
        body: formData,
    })

    loading.value = false

    if (data.value)
        router.push(`/roleplay/${data.value.id}?created=1`)
}
</script>

<template>
    <div>
        <button
            class="mb-4 btn btn-primary"
            @click="router.back()"
        >
            <ArrowLeftIcon class="w-4 h-4" />
            Retour
        </button>
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Nouveau RP
            </h2>
            <Form
                :form="form"
                :loading="loading"
                @file-change="fileChange"
                @submit="submit"
            />
        </div>
    </div>
</template>
