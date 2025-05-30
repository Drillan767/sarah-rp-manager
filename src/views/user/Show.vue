<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()

// const { data: user } = useQuery(getUser, { id: route.params.id })
</script>

<template>
    <h1>User profile</h1>
</template>
