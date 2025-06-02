<script setup lang="ts">
import type { ListTemplatesForUserData } from '@sarah-rp-manager/default-connector'
import { listTemplatesForUser } from '@sarah-rp-manager/default-connector'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import CreateTemplateDialog from '@/components/characters/CreateTemplateDialog.vue'
import CharacterTemplateDetail from '@/components/characters/CharacterTemplateDetail.vue'
import useUsersStore from '@/stores/users'

type Templates = ListTemplatesForUserData['character_templates']

const { user } = storeToRefs(useUsersStore())

const charactersList = ref<Templates>([])
const loading = ref(false)
const createTemplateDialog = ref(false)

async function getCharacters() {
    if (!user.value) {
        return
    }

    loading.value = true
    const { data } = await listTemplatesForUser({ userId: user.value.id })
    charactersList.value = data.character_templates
    loading.value = false
}

onMounted(getCharacters)
</script>

<template>
    <VContainer>
        <VRow>
            <VCol cols="12" md="8">
                <VAlert
                    type="info"
                    variant="tonal"
                    density="compact"
                    class="mb-4"
                >
                    Les modèles de personnages sont utilisés comme base pour la création de personnages.<br>
                    Un modèle public peut être copié par tout utilisateur visitant votre profil.<br>
                    Lors de la création d'un personnage, les informations du modèle seront utilisées comme base, mais restent modifiables.
                </VAlert>
            </VCol>
            <VCol
                cols="12"
                md="4"
                class="d-flex justify-end align-center"
            >
                <VBtn
                    prepend-icon="mdi-plus"
                    variant="outlined"
                    color="primary"
                    @click="createTemplateDialog = true"
                >
                    Nouveau modèle de personnage
                </VBtn>
            </VCol>
        </VRow>
        <VRow>
            <VCol>
                <VDataIterator
                    :items="charactersList"
                    :loading="loading"
                >
                    <template #default="{ items: templates }">
                        <VRow>
                            <VCol
                                v-for="(template, index) in templates"
                                :key="index"
                                cols="12"
                                md="4"
                            >
                                <CharacterTemplateDetail
                                    :template="template.raw"
                                    @saved="getCharacters"
                                />
                            </VCol>
                        </VRow>
                    </template>
                    <template #no-data>
                        <VEmptyState
                            headline="Aucun personnage"
                            title="Vous n'avez pas de roleplay"
                            text="Créez votre premier roleplay pour commencer"
                            icon="mdi-book-open-blank-variant-outline"
                            action-text="Créer mon premier roleplay"
                            color="primary"
                            @click:action="createTemplateDialog = true"
                        />
                    </template>
                </VDataIterator>
            </VCol>
        </VRow>
    </VContainer>
    <CreateTemplateDialog
        v-model="createTemplateDialog"
        @saved="getCharacters"
    />
</template>
