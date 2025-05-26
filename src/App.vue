<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Pegi18Warning from './components/Pegi18Warning.vue'
import useAuth from './composables/auth'

const { initAuth } = useAuth()
const route = useRoute()

onMounted(() => initAuth())

const title = ref('')

useHead({
    titleTemplate: '%s | Sarah RP Manager',
    title: () => title.value,
})

const showNavbar = computed(() => !route?.name?.toString().startsWith('roleplays-rpId-channels'))

watch(route, () => {
    title.value = route.meta.title as string
})
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
