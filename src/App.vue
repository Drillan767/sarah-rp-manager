<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { computed, onMounted, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Pegi18Warning from './components/Pegi18Warning.vue'
import useToast from './composables/toast'
import useAuthStore from './stores/auth'

const route = useRoute()
const { initialize } = useAuthStore()
const { showError, showSuccess } = useToast()

const title = ref('')

useHead({
    titleTemplate: '%s | Sarah RP Manager',
    title: () => title.value,
})

const showNavbar = computed(() => !route?.name?.toString().startsWith('roleplays-rpId-channels'))

watch(route, () => {
    title.value = route.meta.title as string
})

provide('toast', {
    showError,
    showSuccess,
})

onMounted(initialize)
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
