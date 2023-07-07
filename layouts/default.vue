<template>
    <NavBar />

    <main class="bg-base-200 min-h-screen">
        <slot />
    </main>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import NavBar from '@/components/modal/NavBar.vue';
// import { useUserStore } from '@/stores/users';



const router = useRouter()
const userStore = useUserStore()

const { loggedIn } = storeToRefs(userStore)

watch(loggedIn, (newVal) => {
    if (newVal === false) {
        router.push('/connexion')
    }
})

</script>

<style scoped lang="scss"></style>