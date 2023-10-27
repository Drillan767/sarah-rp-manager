<script setup lang="ts">
const { t } = useI18n()

useHead({
    title: t('pages.profile.title')
})

const links = [
    {
        title: t('pages.home'),
        to: '/'
    },
    {
        title: t('pages.profile.title')
    }
]

</script>

<template>
    <VContainer>
        <VRow>
            <VCol>
                <Breadcrumb :links="links" />
                <h1 class="text-h3">{{ t('pages.profile.title') }}</h1>
                <ProfileInformationsForm />
                <ProfileAvailabilityForm />
                <ProfilePasswordForm />
            </VCol>
        </VRow>
    </VContainer>
</template>
