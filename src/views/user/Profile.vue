<script setup lang="ts">
import Breadcrumb from '@/components/Breadcrumb.vue'
import InformationsForm from '@/components/profile/InformationsForm.vue'

const links = [
    {
        title: 'Accueil',
        to: '/',
    },
    {
        title: 'Profil',
    },
]
</script>

<template>
    <VContainer>
        <Breadcrumb :links />
        <VCol>
            <h1 class="text-h3">
                Profil
            </h1>
            <InformationsForm />
            <!-- <ProfileInformationsForm />
                <ProfileAvailabilityForm /> -->
        </VCol>
    </VContainer>
</template>
