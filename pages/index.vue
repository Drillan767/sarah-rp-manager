<script setup lang="ts">

const { t } = useI18n()

useHead({
    title: t('pages.home')
})
</script>

<template>
    <VLayout>
        <Navbar />
    </VLayout>
</template>