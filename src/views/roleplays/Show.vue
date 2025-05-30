<script setup lang="ts">
import type { GetRoleplayData } from '@sarah-rp-manager/default-connector'
import { getRoleplay } from '@sarah-rp-manager/default-connector'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import useUsersStore from '@/stores/users'
import useDayjs from '@/composables/dayjs'

type Roleplay = NonNullable<GetRoleplayData['roleplay']>

const router = useRouter()
const route = useRoute()
const rpId = route.params.id.toString()
const { user } = storeToRefs(useUsersStore())
const dayjs = useDayjs()

const roleplay = ref<Roleplay>()

const totalUsers = computed(() => {
    if (!roleplay.value) {
        return 0
    }

    return roleplay.value.roles.reduce((acc, role) => acc + role.nbCharacters[0]._count, 0)
})

const createdAt = computed(() => {
    if (!roleplay.value) {
        return ''
    }
    return `Créé le ${dayjs(roleplay.value.createdAt).format('DD/MM/YYYY')}`
})

async function getRoleplayData() {
    const data = await getRoleplay({ id: rpId })
    if (!data.data) {
        router.push({ name: 'roleplays' })
        return
    }
    roleplay.value = data.data.roleplay
}

function getPicked(max: number, current: number) {
    
}

onMounted(getRoleplayData)

const links = computed(() => ([
    {
        title: 'Accueil',
        to: '/',
    },
    {
        title: 'Roleplays',
        to: { name: 'roleplays' },
    },
    {
        title: roleplay.value?.title ?? 'Roleplay',
    },
]))
</script>

<template>
    <VContainer v-if="roleplay">
        <Breadcrumb :links="links" />
        <VRow>
            <VCol>
                <VCard rounded="xl">
                    <VImg
                        :src="roleplay.illustration"
                        class="align-end"
                        height="400"
                        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                        :cover="true"
                    />
                    <VCardText>
                        <VContainer>
                            <VRow>
                                <VCol cols="12" md="10">
                                    <h1 class="text-h4 font-weight-bold">
                                        {{ roleplay.title }}
                                    </h1>

                                    <div class="author mb-4">
                                        <VListItem
                                            :prepend-avatar="roleplay.user?.avatar"
                                            :title="roleplay.user?.username"
                                            :subtitle="roleplay.user?.handle"
                                            :to="{ name: 'user-show', params: { id: roleplay.user?.id } }"
                                            class="d-inline-flex"
                                        />
                                    </div>

                                    <div class="meta mb-4">
                                        <VChip
                                            :text="`${totalUsers} inscrit${totalUsers > 1 ? 's' : ''}`"
                                            prepend-icon="mdi-account-multiple"
                                            variant="text"
                                        />

                                        <VChip
                                            :text="createdAt"
                                            prepend-icon="mdi-calendar-outline"
                                            variant="text"
                                            class="mr-4"
                                        />

                                        <VChip
                                            v-if="roleplay.startDate"
                                            :text="`Début le ${dayjs(roleplay.startDate).format('DD/MM/YYYY')}`"
                                            prepend-icon="mdi-calendar-clock-outline"
                                            variant="text"
                                            class="mr-4"
                                        />
                                    </div>
                                </VCol>
                                <VCol
                                    cols="12"
                                    md="2"
                                    class="d-flex flex-column ga-4"
                                >
                                    <VBtn
                                        color="primary"
                                        variant="flat"
                                        prepend-icon="mdi-account-plus"
                                    >
                                        Rejoindre
                                    </VBtn>
                                    <VBtn
                                        v-if="user?.id === roleplay?.user?.id"
                                        color="orange"
                                        variant="flat"
                                        prepend-icon="mdi-book-edit-outline"
                                        :to="{ name: 'user-roleplays-edit', params: { rpId: roleplay.id } }"
                                        class="ml-4"
                                    >
                                        Modifier
                                    </VBtn>
                                </VCol>
                            </VRow>
                        </VContainer>
                    </VCardText>
                </VCard>
            </VCol>
        </VRow>
        <VRow>
            <VCol
                cols="12"
                md="8"
            >
                <VCard
                    prepend-icon="mdi-text-box-edit-outline"
                    rounded="xl"
                >
                    <template #title>
                        <h2>Description</h2>
                    </template>
                    <VCardText v-html="roleplay.description" />
                </VCard>
            </VCol>
            <VCol>
                <VCard
                    prepend-icon="mdi-account-multiple-outline"
                    rounded="xl"
                >
                    <template #title>
                        <h2>Rôles disponibles</h2>
                    </template>
                    <VCardText>
                        <VRow
                            v-for="(role, i) in roleplay.roles"
                            :key="i"
                        >
                            <VCol>
                                <VHover>
                                    <template #default="{ props: hover, isHovering }">
                                        <VCard
                                            v-bind="hover"
                                            :title="role.name"
                                            :text="role.description"
                                            :disabled="role.nbCharacters[0]._count === role.maxUsers"
                                            variant="flat"
                                            :elevation="isHovering ? 12 : 2"
                                        >
                                            <template #actions>
                                                <VContainer>
                                                    <VRow no-gutters>
                                                        <VCol>
                                                            <VChip
                                                                :text="`${role.nbCharacters[0]._count} / ${role.maxUsers} rôle${role.maxUsers > 1 ? 's' : ''} choisi${role.maxUsers > 1 ? 's' : ''}`"
                                                                prepend-icon="mdi-account-multiple-outline"
                                                                variant="text"
                                                                density="compact"
                                                                class="text-caption"
                                                            />
                                                        </VCol>
                                                        <VSpacer />
                                                        <span
                                                            :class="role.maxUsers - role.nbCharacters[0]._count === 0 ? 'text-grey' : 'text-success'"
                                                            class="text-caption"
                                                        >
                                                            {{ role.maxUsers - role.nbCharacters[0]._count }} disponibles
                                                        </span>
                                                    </VRow>
                                                    <VRow no-gutters>
                                                        <VCol>
                                                            <VProgressLinear
                                                                :model-value="role.nbCharacters[0]._count"
                                                                :max="role.maxUsers"
                                                                :color="role.nbCharacters[0]._count === role.maxUsers ? 'grey' : 'primary'"
                                                                height="10"
                                                                rounded="pill"
                                                                class="mt-2"
                                                            />
                                                        </VCol>
                                                    </VRow>
                                                </VContainer>
                                            </template>
                                        </VCard>
                                    </template>
                                </VHover>
                            </VCol>
                        </VRow>
                    </VCardText>
                </VCard>
            </VCol>
        </VRow>
    </VContainer>
</template>
