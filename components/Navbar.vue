<script setup lang="ts">
import NavBarMenu from './layout/NavBarMenu.vue'
</script>

<template>
    <VAppBar
        title="Le Jardin de Sarah"
        class="px-6"
    >
        <template #prepend>
            <RouterLink to="/">
                <VAvatar :tile="true" image="/sarah.jpg" />
            </RouterLink>
        </template>
        <template #append>
            <NavBarMenu :display-username="true" />
        </template>
    </VAppBar>
</template>
