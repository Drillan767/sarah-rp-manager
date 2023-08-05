<script setup>
import { storeToRefs } from 'pinia'
import NavBar from '@/components/NavBar.vue'

// import { useUserStore } from '@/stores/users';

const router = useRouter()
const userStore = useUserStore()

const { loggedIn } = storeToRefs(userStore)

watch(loggedIn, (newVal) => {
    if (newVal === false)
        router.push('/connexion')
})
</script>

<template>
    <NavBar />

    <main class="bg-base-100 min-h-screen p-5">
        <slot />
    </main>
</template>

<style scoped lang="scss"></style>
