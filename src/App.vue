<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Pegi18Warning from './components/Pegi18Warning.vue'
import useAuth from './composables/auth'

const { initAuth } = useAuth()
const route = useRoute()

onMounted(() => initAuth())

useHead({
    titleTemplate: '%s | Sarah RP Manager',
    title: () => route.meta.title,
})

const showNavbar = computed(() => !route?.name?.toString().startsWith('roleplays-rpId-channels'))
</script>

<template>
    <VApp>
        <VLayout>
            <Navbar v-if="showNavbar" />
            <VMain>
                <RouterView />
            </VMain>
            <Pegi18Warning />
        </VLayout>
    </VApp>
</template>
