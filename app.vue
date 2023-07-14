<template>
  <NuxtLayout :name="whichLayout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const route = useRoute();

const regex = /\/(oubli-mdp|connexion|inscription|nouveau-mdp)(\#.*)?/

const whichLayout = computed(() => {

  return regex.test(route.fullPath) ? 'auth' : 'default'
})

</script>