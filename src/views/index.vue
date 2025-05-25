<script setup lang="ts">
import useUsersStore from '@/stores/users'

const { signIn } = useUsersStore()
</script>

<template>
    <div>
        <h1>Home</h1>
        <VBtn @click="signIn">
            Sign In
        </VBtn>
    </div>
</template>
