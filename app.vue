<script setup lang="ts">
    const route = useRoute()

    const regex = /\/(forgot-password|login|register|new-password)(\#.*)?/
    const whichLayout = computed(() => regex.test(route.fullPath) ? 'auth' : 'default')
</script>

<template>
    <NuxtLayout :name="whichLayout">
        <NuxtPage />
        <Snackbar />
    </NuxtLayout>
</template>
