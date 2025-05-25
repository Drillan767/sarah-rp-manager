<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import useAuth from './composables/auth'

const { initAuth } = useAuth()

const route = useRoute()

onMounted(() => initAuth())

const showNavbar = computed(() => !route?.name?.toString().startsWith('roleplays-rpId-channels'))
</script>

<template>
    <VApp>
        <VLayout>
            <Navbar v-if="showNavbar" />
            <VMain>
                <RouterView />
            </VMain>
        </VLayout>
    </VApp>
</template>
