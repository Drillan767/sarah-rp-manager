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
    roleplays.value = data.roleplays ?? []
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
    </VContainer>
</template>
