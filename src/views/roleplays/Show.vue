<script setup lang="ts">
import type { GetRoleplayData, ListTemplatesForUserData } from '@sarah-rp-manager/default-connector'
import { getRoleplay, listTemplatesForUser } from '@sarah-rp-manager/default-connector'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import RoleplayParticipationForm from '@/components/roleplays/RoleplayParticipationForm.vue'
import useDayjs from '@/composables/dayjs'
import useUsersStore from '@/stores/users'

type Roleplay = NonNullable<GetRoleplayData['roleplay']>
type Templates = NonNullable<ListTemplatesForUserData['character_templates']>

interface RoleInformation {
    id: string
    name: string
    description: string
    disabled: boolean
    nbPickedText: string
    nbAvailableText: string
    nbCharacters: number
    maxUsers: number
    nbAvailableColor: 'text-error' | 'text-success'
}

const router = useRouter()
const route = useRoute()
const rpId = route.params.id.toString()
const { user } = storeToRefs(useUsersStore())
const dayjs = useDayjs()

const roleplay = ref<Roleplay>()
const pickedRole = ref<string>()
const userTemplates = ref<Templates>([])
const displayParticipationForm = ref(false)

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

const rolesInformations = computed<RoleInformation[]>(() => {
    if (!roleplay.value) {
        return []
    }

    return roleplay.value.roles.map(role => {

        const userPicked = userTemplates.value.some(template => template.participations.some(p => p.roleplay.roles.some(r => r.id === role.id)))
        const roleFull = role.nbCharacters[0]._count === role.maxUsers
        const nbPickedText = `${role.nbCharacters[0]._count} / ${role.maxUsers} rôle${role.maxUsers > 1 ? 's' : ''} choisi${role.maxUsers > 1 ? 's' : ''}`
        const nbAvailableText = userPicked
            ? 'Vous avez déjà choisi ce rôle'
            : `${role.maxUsers - role.nbCharacters[0]._count} disponible${role.maxUsers > 1 ? 's' : ''}`
        const nbAvailableColor = userPicked
            ? 'text-error'
            : roleFull
                ? 'text-error'
                : 'text-success'

        return {
            id: role.id,
            name: role.name,
            description: role.description,
            disabled: userPicked || roleFull,
            nbPickedText,
            nbAvailableText,
            nbAvailableColor,
            nbCharacters: role.nbCharacters[0]._count,
            maxUsers: role.maxUsers,
        }
    })
})

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

const joinDisabled = computed(() => {
    if (!roleplay.value) {
        return true
    }

    return roleplay.value.roles.every(role => {
        const roleFull = role.nbCharacters[0]._count === role.maxUsers
        const userPicked = userTemplates.value.some(template => template.participations.some(p => p.roleplay.roles.some(r => r.id === role.id)))

        return roleFull || userPicked
    })
})

async function getRoleplayData() {
    const data = await getRoleplay({ id: rpId })
    if (!data.data) {
        router.push({ name: 'roleplays' })
        return
    }
    roleplay.value = data.data.roleplay
}

async function getUserTemplates() {
    if (!user.value?.id) {
        return
    }
    const data = await listTemplatesForUser({ userId: user.value.id })
    userTemplates.value = data.data?.character_templates ?? []
}

function joinRoleplay(roleId?: string) {
    pickedRole.value = roleId
    displayParticipationForm.value = true
}

onMounted(() => {
    getRoleplayData()
    getUserTemplates()
})

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
                                        :disabled="joinDisabled"
                                        color="primary"
                                        variant="flat"
                                        prepend-icon="mdi-account-plus"
                                        @click="joinRoleplay()"
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
                    <VCardText>
                        <div v-html="roleplay.description" />
                    </VCardText>
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
                            v-for="(role, i) in rolesInformations"
                            :key="i"
                        >
                            <VCol>
                                <VHover>
                                    <template #default="{ props: hover, isHovering }">
                                        <VCard
                                            v-bind="hover"
                                            :title="role.name"
                                            :text="role.description"
                                            :disabled="role.disabled"
                                            variant="flat"
                                            :elevation="isHovering ? 4 : 2"
                                            @click="joinRoleplay(role.id)"
                                        >
                                            <template #actions>
                                                <VContainer>
                                                    <VRow no-gutters>
                                                        <VCol>
                                                            <VChip
                                                                :text="role.nbPickedText"
                                                                prepend-icon="mdi-account-multiple-outline"
                                                                variant="text"
                                                                density="compact"
                                                                class="text-caption"
                                                            />
                                                        </VCol>
                                                        <VSpacer />
                                                        <span
                                                            :class="role.nbAvailableColor"
                                                            class="text-caption"
                                                        >
                                                            {{ role.nbAvailableText }}
                                                        </span>
                                                    </VRow>
                                                    <VRow no-gutters>
                                                        <VCol>
                                                            <VProgressLinear
                                                                :model-value="role.nbCharacters"
                                                                :max="role.maxUsers"
                                                                :color="role.nbAvailableColor"
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
        <RoleplayParticipationForm
            v-model:open="displayParticipationForm"
            v-model:roleplay="roleplay"
            v-model:role="pickedRole"
        />
    </VContainer>
</template>
