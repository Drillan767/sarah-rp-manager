<template>
    <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Informations du profil</h2>
        <Form />
    </div>
</template>

<script setup lang="ts">
import Form from '@/components/rp/form.vue'
useHead({
    title: 'Nouveau RP'
})
</script>