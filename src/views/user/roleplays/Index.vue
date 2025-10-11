<script setup lang="ts">
import type { Roleplay } from '@/util/repositories/roleplays'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useUsersStore from '@/stores/auth'
import { listRpForUser } from '@/util/repositories/roleplays'

const { user } = storeToRefs(useUsersStore())
const router = useRouter()

const roleplays = ref<Roleplay[]>([])
const loading = ref(false)

async function getRoleplays() {
    if (!user.value?.id)
        return
    loading.value = true
    const rpList = await listRpForUser(user.value.id)
    roleplays.value = rpList
    loading.value = false
}

function createRoleplay() {
    router.push({ name: 'user-roleplays-create' })
}

onMounted(getRoleplays)
</script>

<template>
    <VContainer fluid>
        <VRow>
            <VCol class="d-flex justify-end">
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
            <VCol>
                <VDataIterator
                    :items="roleplays"
                    :loading="loading"
                >
                    <template #default="{ items: rpList }">
                        <VRow>
                            <template v-if="loading">
                                <VCol
                                    v-for="i in 4"
                                    :key="i"
                                    cols="12"
                                    md="3"
                                >
                                    <VSkeletonLoader
                                        height="240"
                                        type="image, list-item-two-line"
                                    />
                                </VCol>
                            </template>
                            <template v-else>
                                <VCol
                                    v-for="(rp, i) in rpList"
                                    :key="i"
                                    cols="12"
                                    md="3"
                                >
                                    <VCard
                                        :to="{ name: 'user-roleplays-edit', params: { rpId: rp.raw.id } }"
                                    >
                                        <VImg
                                            :src="rp.raw.illustration"
                                            :cover="true"
                                            height="250"
                                        />
                                        <VCardTitle>
                                            {{ rp.raw.title }}
                                        </VCardTitle>
                                    </VCard>
                                </VCol>
                            </template>
                        </VRow>
                    </template>
                    <template #no-data>
                        <VEmptyState
                            headline="Aucun roleplay"
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
