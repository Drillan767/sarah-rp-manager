<script setup>
import NavBar from '@/components/NavBar.vue'
</script>

<template>
    <NavBar />

    <main class="bg-base-100 min-h-screen p-5">
        <slot />
    </main>
</template>
