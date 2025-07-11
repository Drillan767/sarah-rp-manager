<script setup lang="ts">
import type { GetRoleplayData, ListParticipationsForUserData, ListTemplatesForUserData } from '@sarah-rp-manager/default-connector'
import type { ParticipationRole } from '@/types/forms'
import { getRoleplay, listParticipationsForUser, listTemplatesForUser } from '@sarah-rp-manager/default-connector'
import { useHead } from '@vueuse/head'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import RoleplayParticipationForm from '@/components/roleplays/RoleplayParticipationForm.vue'
import useDayjs from '@/composables/dayjs'
import useUsersStore from '@/stores/users'

type Roleplay = NonNullable<GetRoleplayData['roleplay']>
type Templates = NonNullable<ListTemplatesForUserData['character_templates']>
type Participations = NonNullable<ListParticipationsForUserData['participations']>

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
const userParticipations = ref<Participations>([])
const displayParticipationForm = ref(false)

const totalUsers = computed(() => {
    if (!roleplay.value) {
        return 0
    }

    return roleplay.value.roles.reduce((acc, role) => acc + role.participations.length, 0)
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

    return roleplay.value.roles.map((role) => {
        const userPicked = userParticipations.value.some(p => p.role.id === role.id)
        const roleFull = role.participations.length === role.maxUsers
        const nbPickedText = `${role.participations.length} / ${role.maxUsers} rôle${role.maxUsers > 1 ? 's' : ''} choisi${role.maxUsers > 1 ? 's' : ''}`
        const nbAvailableText = userPicked
            ? 'Vous avez déjà choisi ce rôle'
            : `${role.maxUsers - role.participations.length} disponible${role.maxUsers > 1 ? 's' : ''}`
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
            nbCharacters: role.participations.length,
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

    return rolesInformations.value.every(role => role.disabled)
})

async function getRoleplayData() {
    const { data } = await getRoleplay({ id: rpId })
    if (!data) {
        router.push({ name: 'roleplays' })
        return
    }
    roleplay.value = data.roleplay
}

async function getUserTemplates() {
    if (!user.value?.id) {
        return
    }
    const data = await listTemplatesForUser({ userId: user.value.id })
    userTemplates.value = data.data?.character_templates ?? []
}

async function getUserParticipations() {
    if (!user.value?.id) {
        return
    }
    const { data } = await listParticipationsForUser({ userId: user.value.id })
    userParticipations.value = data?.participations ?? []
}

function joinRoleplay(role?: ParticipationRole) {
    pickedRole.value = role?.id
    displayParticipationForm.value = true
}

function handleParticipation() {
    router.push({ name: 'roleplay-channels', params: { id: rpId } })
}

onMounted(() => {
    getRoleplayData()
    getUserTemplates()
    getUserParticipations()
})

useHead({
    title: computed(() => roleplay.value?.title ?? 'Roleplay'),
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
                                        v-if="userParticipations.some(p => roleplay?.roles.some(r => r.id === p.role.id))"
                                        :to="{ name: 'roleplay-channels', params: { id: roleplay.id } }"
                                        color="primary"
                                        variant="flat"
                                        prepend-icon="mdi-login"
                                    >
                                        Accéder
                                    </VBtn>
                                    <VBtn
                                        v-else
                                        :disabled="joinDisabled"
                                        color="primary"
                                        variant="flat"
                                        prepend-icon="mdi-account-plus"
                                        @click="joinRoleplay"
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
                        <h2>
                            Description
                        </h2>
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
                                            @click="joinRoleplay(role)"
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
            :roleplay="roleplay"
            :role="pickedRole"
            :characters="userTemplates"
            :participations="userParticipations"
            @joined="handleParticipation"
        />
    </VContainer>
</template>
