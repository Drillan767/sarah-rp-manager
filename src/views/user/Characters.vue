<script setup lang="ts">
import type { ListCharactersForUserData } from '@sarah-rp-manager/default-connector'
import { listCharactersForUser } from '@sarah-rp-manager/default-connector'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import useUsersStore from '@/stores/users'

type Characters = ListCharactersForUserData['characters']

const { user } = storeToRefs(useUsersStore())

const charactersList = ref<Characters>([])
const loading = ref(false)
const createCharacterDialog = ref(false)

async function getCharacters() {
    if (!user.value) {
        return
    }

    loading.value = true
    const { data } = await listCharactersForUser({ userId: user.value.id })
    charactersList.value = data.characters
    loading.value = false
}

onMounted(getCharacters)
</script>

<template>
    <VContainer>
        <VRow>
            <VCol class="d-flex justify-end">
                <VBtn
                    prepend-icon="mdi-plus"
                    variant="outlined"
                    color="primary"
                >
                    Nouveau personnage
                </VBtn>
            </VCol>
        </VRow>
        <VRow>
            <VCol>
                <VDataIterator
                    :items="charactersList"
                    :loading="loading"
                >
                    <template #default="{ items: characters }" />
                    <template #no-data>
                        <VEmptyState
                            headline="Aucun personnage"
                            title="Vous n'avez pas de roleplay"
                            text="Créez votre premier roleplay pour commencer"
                            icon="mdi-book-open-blank-variant-outline"
                            action-text="Créer mon premier roleplay"
                            color="primary"
                            @click:action="createRoleplay"
                        />
                    </template>
                </VDataIterator>
            </VCol>
        </VRow>
    </VContainer>
</template>
