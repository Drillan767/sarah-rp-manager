<script setup lang="ts">
import type { ListRoleplaysData } from '@sarah-rp-manager/default-connector'
import { listRoleplays } from '@sarah-rp-manager/default-connector'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import useDayjs from '@/composables/dayjs'
import useUsersStore from '@/stores/users'

const { user } = storeToRefs(useUsersStore())
const dayjs = useDayjs()

const search = ref<string>()
const itemsPerPage = ref(12)
const roleplays = ref<ListRoleplaysData['roleplays']>([])

async function getRoleplays() {
    const { data } = await listRoleplays({
        search: search.value,
    })
    roleplays.value = data.roleplays
}

onMounted(getRoleplays)
const links = [
    {
        title: 'Accueil',
        to: '/',
    },
    {
        title: 'Roleplays',
    },
]
</script>

<template>
    <VContainer>
        <Breadcrumb :links />
        <VRow>
            <VCol>
                <h1 class="text-h3">
                    Tous les roleplays
                </h1>
            </VCol>
            <VSpacer />
            <VCol
                v-if="user"
                class="d-flex justify-end"
            >
                <VBtn
                    :to="{ name: 'user-roleplays-create' }"
                    prepend-icon="mdi-plus"
                    variant="outlined"
                    color="primary"
                >
                    Nouveau roleplay
                </VBtn>
            </VCol>
        </VRow>
        <VRow>
            <VSpacer />
            <VCol cols="12" md="3">
                <VTextField
                    v-model="search"
                    label="Rechercher"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    hide-details
                />
            </VCol>
        </VRow>
    </VContainer>
    <VDataIterator
        :items="roleplays"
        :items-per-page="itemsPerPage"
        :search="search"
    >
        <template #default="{ items }">
            <VContainer>
                <VRow>
                    <VCol
                        v-for="item in items"
                        :key="item.raw.id"
                        cols="12"
                        md="4"
                    >
                        <VCard>
                            <VImg
                                :src="item.raw.illustration"
                                height="250"
                                :cover="true"
                            />
                            <VCardTitle>{{ item.raw.title }}</VCardTitle>
                            <VCardText>
                                <VRow>
                                    <VCol>
                                        <VChip
                                            prepend-icon="mdi-account-group"
                                            :text="`${item.raw.nbCharacters[0]._count} joueurs`"
                                        />
                                    </VCol>
                                    <VCol
                                        v-if="item.raw.startDate"
                                        cols="12"
                                        md="6"
                                        class="d-flex justify-end"
                                    >
                                        <VChip
                                            prepend-icon="mdi-calendar"
                                            :text="`${dayjs(item.raw.startDate).format('DD/MM/YYYY')}`"
                                        />
                                    </VCol>
                                </VRow>
                            </VCardText>
                            <VCardActions>
                                <VChip
                                    :text="item.raw.user.handle"
                                    prepend-icon="mdi-account"
                                    variant="outlined"
                                    label
                                />
                                <VSpacer />
                                <VBtn
                                    :to="{ name: 'roleplay-details', params: { id: item.raw.id } }"
                                    color="primary"
                                    variant="flat"
                                >
                                    Voir
                                </VBtn>
                            </VCardActions>
                        </VCard>
                    </VCol>
                </VRow>
            </VContainer>
        </template>
    </VDataIterator>
</template>
