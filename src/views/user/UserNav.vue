<script setup lang="ts">
import { useDisplay } from 'vuetify'
import Breadcrumb from '@/components/Breadcrumb.vue'

const { mobile } = useDisplay()

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
    <VContainer fluid>
        <Breadcrumb :links />
        <VCol>
            <h1 class="text-h3 mb-4">
                Profil
            </h1>
            <div
                class="d-flex"
                :class="[mobile ? 'flex-column' : 'flex-row']"
            >
                <VTabs
                    direction="vertical"
                    color="primary"
                >
                    <VTab
                        :to="{ name: 'user-profile-informations' }"
                        text="Informations personnelles"
                        prepend-icon="mdi-account-edit"
                    />
                    <VTab
                        :to="{ name: 'user-roleplays' }"
                        text="Mes roleplays"
                        prepend-icon="mdi-book-open-page-variant-outline"
                    />
                    <VTab
                        :to="{ name: 'user-characters' }"
                        text="Mes personnages"
                        prepend-icon="mdi-account-box-multiple"
                    />
                </VTabs>
                <VTabsWindow class="flex-grow-1">
                    <RouterView />
                </VTabsWindow>
            </div>
        </VCol>
    </VContainer>
</template>
