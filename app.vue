<template>
  <NuxtLayout :name="whichLayout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const route = useRoute();

const whichLayout = computed(() => {
  const authRoutes = [
    '/connexion',
    '/inscription',
    '/oubli-mdp',
    '/nouveau-mdp',
  ]

  return authRoutes.includes(route.fullPath) ? 'auth' : 'default'
})

</script>