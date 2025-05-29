<script setup lang="ts">
import type { ListRoleplaysForUserData } from '@sarah-rp-manager/default-connector'
import { listRoleplaysForUser } from '@sarah-rp-manager/default-connector'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import useUsersStore from '@/stores/users'

type RoleplayList = NonNullable<ListRoleplaysForUserData['roleplays']>

const { user } = storeToRefs(useUsersStore())

const roleplays = ref<RoleplayList>([])
const loading = ref(false)

async function getRoleplays() {
    if (!user.value?.id)
        return
    loading.value = true
    const { data } = await listRoleplaysForUser({ userId: user.value.id })
    roleplays.value = data.roleplays
    loading.value = false
}

onMounted(getRoleplays)

const links = [
    {
        title: 'Accueil',
        to: '/',
    },
    {
        title: 'Mes roleplays',
    },
]
</script>

<template>
    <VContainer>
        <Breadcrumb :links />
        <VRow>
            <VCol>
                <h1 class="text-h3">
                    Mes roleplays
                </h1>
            </VCol>
            <VSpacer />
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
                </VDataIterator>
            </VCol>
        </VRow>
    </VContainer>
</template>
