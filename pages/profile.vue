<script setup lang="ts">
const { t } = useI18n()

useHead({
    title: t('pages.profile.title'),
})

const links = [
    {
        title: t('pages.home'),
        to: '/',
    },
    {
        title: t('pages.profile.title'),
    },
]
</script>

<template>
    <VContainer>
        <Breadcrumb :links="links" />
        <VRow>
            <VCol>
                <h1 class="text-h3">
                    {{ t('pages.profile.title') }}
                </h1>
                <ProfileInformationsForm />
                <ProfileAvailabilityForm />
            </VCol>
        </VRow>
    </VContainer>
</template>
