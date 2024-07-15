<script setup lang="ts">
const route = useRoute()
const whichLayout = computed(() => route.name?.toString().startsWith('roleplays-rpId-channels') ? 'channels' : 'default')
</script>

<template>
    <NuxtLayout :name="whichLayout">
        <NuxtPage />
        <Snackbar />
        <Pegi18Warning />
    </NuxtLayout>
</template>
