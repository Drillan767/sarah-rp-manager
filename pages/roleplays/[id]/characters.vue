<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import type { Character, DataTableHeader } from '~/types/models'
import type { Database } from '~/types/supabase'
import useSnackBar from '~/composables/snackbar'
import useValidation from '~/composables/useValidation'

interface RoleplayData {
    id: string
    title: string
    roles: {
        id: number
        name: string
        max_users: number
        description: string
        roleplay_id: string
        characters: {
            id: number
            name: string
            user_id: number
            status: number
            illustration: string
            description: string
            user: {
                id: number
                username: string
            } | null
        }[]
    }[]
}

interface BlockedUser {
    id: number
    user: {
        id: number
        username: string
    } | null
    created_at: string
    reason: string
}

const supabase = useSupabaseClient<Database>()
const { t } = useI18n()
const dayjs = useDayjs()
const { showSuccess } = useSnackBar()
const { requiredRule } = useValidation()
const rpId = useRouteParams('id', null, { transform: String })

const statusList = [
    {
        number: -1,
        label: t('pages.roleplays.characters.waiting_list'),
        color: 'blue-gray',
    },
    {
        number: 0,
        label: t('pages.roleplays.characters.pending'),
        color: 'orange',
    },
    {
        number: 1,
        label: t('pages.roleplays.characters.accepted'),
        color: 'green',
    },
    {
        number: 2,
        label: t('pages.roleplays.characters.moderator'),
        color: 'yellow',
    },
]

const displayBlockDialog = ref(false)
const loading = ref(false)
const tabs = ref(1)
const openCharacterDetails = ref(false)
const roleplay = ref<RoleplayData>({} as RoleplayData)
const selectedCharacter = ref<Character>({} as Character)
const blockedUsers = ref<BlockedUser[]>([])
const expanded = ref([])

const blockForm = ref({
    user_id: 0,
    username: '',
    reason: '',
    roleplay_id: '',
})

async function fetch() {
    loading.value = true

    const { data: rpData } = await supabase
        .from('roleplays')
        .select(`
            id,
            title,
            roles(
                id,
                name,
                roleplay_id,
                max_users,
                description,
                characters(
                    id,
                    illustration,
                    description,
                    user_id,
                    status,
                    name,
                    user:users(
                        id,
                        username
                    )
                )
            )
        `)
        .eq('id', rpId.value)
        .single()

    if (rpData)
        roleplay.value = rpData

    const { data: blockedList } = await supabase
        .from('blacklists')
        .select(`*, user:users(id, username)`)
        .eq('roleplay_id', rpId.value)

    if (blockedList)
        blockedUsers.value = blockedList

    loading.value = false
}

const getStatus = (status: number) => statusList.find(s => s.number === status)

function openDetails(character: Character) {
    openCharacterDetails.value = true
    selectedCharacter.value = character
}

function showBlockDialog(user: { username: string, id: number }) {
    blockForm.value.username = user.username
    blockForm.value.user_id = user.id
    blockForm.value.roleplay_id = roleplay.value.id
    displayBlockDialog.value = true
}

useHead({
    title: t('pages.roleplays.characters.self', 2),
})

watch(rpId, (value) => {
    if (value)
        fetch()
})

onMounted(() => fetch())

async function blockUser() {
    loading.value = true
    await useFetch('/api/rp/block', {
        method: 'POST',
        body: blockForm.value,
    })

    blockForm.value = {
        user_id: 0,
        username: '',
        reason: '',
        roleplay_id: '',
    }

    loading.value = false

    showSuccess('L\'utilisateur a été bloqué et tous ses personnages ont été supprimés pour ce roleplay')
    displayBlockDialog.value = false

    await fetch()
}

async function handleDecision(decision: number) {
    loading.value = true

    if (decision === -2) {
        await useFetch('/api/character/remove', {
            body: {
                id: selectedCharacter.value.id,
                method: 'DELETE',
            },
        })

        showSuccess('Personnage refusé avec succès')
    }
    else {
        await useFetch('/api/rp/accept', {
            method: 'POST',
            body: {
                id: selectedCharacter.value.id,
                decision,
            },
        })

        showSuccess('Statut du personnage mit à jour')
    }

    openCharacterDetails.value = false
    loading.value = false
    await fetch()
}

const links = computed(() => ([
    {
        title: t('pages.home'),
        to: '/',
    },
    {
        title: roleplay.value.title,
        to: `/roleplays/${roleplay.value.id}`,
    },
    {
        title: t('pages.roleplays.characters.self', 2),
    },
]))

const blockedListHeaders: DataTableHeader[] = [
    {
        title: t('fields.username'),
        key: 'user.username',
        align: 'start',
    },
    {
        title: t('pages.roleplays.characters.date'),
        key: 'created_at',
        align: 'end',
    },
    {
        title: 'Actions',
        key: '',
        align: 'end',
    },
]
</script>

<template>
    <div>
        <VContainer>
            <VRow>
                <VCol>
                    <Breadcrumb
                        :links="links"
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol cols="12" md="6">
                    <h1 class="text-h3 mb-4">
                        {{ t('pages.roleplays.characters.self', 2) }}
                    </h1>
                </VCol>
                <VCol
                    cols="12"
                    md="6"
                    class="d-flex justify-end align-center"
                >
                    <VTabs v-model="tabs">
                        <VTab
                            :to="`/roleplays/${roleplay.id}/characters`"
                            :value="1"
                        >
                            {{ t('pages.roleplays.characters.self', 2) }}
                        </VTab>
                        <VTab
                            :to="`/roleplays/${rpId}/edit`"
                            :value="2"
                        >
                            {{ t('form.edit') }}
                        </VTab>
                        <VTab
                            :to="`/roleplays/${roleplay.id}`"
                            :value="3"
                        >
                            {{ t('common.see') }}
                        </VTab>
                    </VTabs>
                </VCol>
            </VRow>
            <VRow
                v-for="(role, i) in roleplay.roles"
                :key="i"
            >
                <VCol cols="12">
                    <h2 class="text-h4">
                        {{ role.name }}
                    </h2>
                </VCol>
                <VCol cols="12">
                    <VRow>
                        <VCol
                            v-for="(character, j) in role.characters"
                            :key="j"
                            cols="2"
                        >
                            <VCard>
                                <VImg
                                    :src="character.illustration"
                                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                                    height="200px"
                                    content-class="d-flex flex-column justify-space-between"
                                    :cover="true"
                                >
                                    <VToolbar
                                        color="rgba(0, 0, 0, 0)"
                                        theme="dark"
                                    >
                                        <template #append>
                                            <VBtn
                                                v-if="character.user"
                                                variant="text"
                                                color="red"
                                                icon="mdi-cancel"
                                                @click="showBlockDialog(character.user)"
                                            />
                                        </template>
                                    </VToolbar>
                                    <VCardTitle class="text-white">
                                        {{ character.name }}
                                    </VCardTitle>
                                </VImg>
                                <VCardActions>
                                    <VChip
                                        :color="getStatus(character.status)!.color"
                                        :text="getStatus(character.status)!.label"
                                    />
                                    <VSpacer />
                                    <VBtn
                                        icon="mdi-cog"
                                        @click="openDetails(character)"
                                    />
                                </VCardActions>
                            </VCard>
                        </VCol>
                        <VCol
                            v-for="j in (role.max_users - role.characters.length)"
                            :key="j"
                            cols="2"
                        >
                            <VCard
                                variant="tonal"
                            >
                                <VImg
                                    src="/default-avatar.webp"
                                    class="align-end"
                                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                                    height="200px"
                                    :cover="true"
                                >
                                    <VCardTitle class="text-white">
                                        {{ t('pages.roleplays.characters.available') }}
                                    </VCardTitle>
                                </VImg>
                                <VCardActions>
                                    <VSpacer />
                                </VCardActions>
                            </VCard>
                        </VCol>
                    </VRow>
                </VCol>
            </VRow>
        </VContainer>

        <VDivider class="my-8" />
        <VContainer>
            <VRow>
                <VRow>
                    <VCard
                        prepend-icon="mdi-account-cancel"
                        :title="t('block.users')"
                        class="my-4 w-100"
                    >
                        <template #text>
                            <VDataTable
                                v-model:expanded="expanded"
                                :loading="loading"
                                :headers="blockedListHeaders"
                                :items="blockedUsers"
                            >
                                <template #item.username="{ value }">
                                    {{ value?.username }}
                                </template>
                                <template #item.created_at="{ value }">
                                    {{ dayjs(value).format('DD/MM/YYYY') }}
                                </template>
                                <template #item.actions>
                                    <VBtn>
                                        {{ t('block.cancel') }}
                                    </VBtn>
                                </template>
                            </VDataTable>
                        </template>
                    </VCard>
                </VRow>
            </VRow>
        </VContainer>
        <VDialog
            v-if="selectedCharacter.id"
            v-model="openCharacterDetails"
            width="750"
        >
            <VCard>
                <VImg
                    :src="selectedCharacter.illustration"
                    class="align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="300px"
                    :cover="true"
                >
                    <VCardTitle class="text-white d-flex justify-space-between ">
                        <p>
                            <span>{{ selectedCharacter.name }}</span>
                            <span
                                v-if="selectedCharacter.user"
                                class="text-subtitle-1 ml-2"
                            >
                                ({{ selectedCharacter.user?.username }})
                            </span>
                        </p>
                        <VChip
                            variant="flat"
                            :color="getStatus(selectedCharacter.status)!.color"
                            :text="getStatus(selectedCharacter.status)!.label"
                        />
                    </VCardTitle>
                </VImg>

                <VCardText>
                    {{ selectedCharacter.description }}
                </VCardText>
                <VCardActions>
                    <VBtn
                        color="red"
                        @click="handleDecision(-2)"
                    >
                        {{ t('form.refuse') }}
                    </VBtn>
                    <VSpacer />
                    <VBtn
                        color="blue"
                        @click="handleDecision(-1)"
                    >
                        {{ t('pages.roleplays.characters.waiting_list') }}
                    </VBtn>
                    <VBtn
                        color="green"
                        @click="handleDecision(1)"
                    >
                        {{ t('form.accept') }}
                    </VBtn>
                </VCardActions>
            </VCard>
        </VDialog>
        <VDialog
            v-model="displayBlockDialog"
            width="500"
        >
            <VCard
                :loading="loading"
                prepend-icon="mdi-account-cancel"
            >
                <template #title>
                    {{ t('block.verb') }} {{ blockForm.username }} ?
                </template>
                <VForm @submit.prevent="blockUser">
                    <VCardText>
                        <VAlert
                            variant="tonal"
                            type="warning"
                            density="compact"
                            class="mb-4"
                            :text="t('block.warning_rp')"
                        />
                        <VTextarea
                            v-model="blockForm.reason"
                            variant="outlined"
                            color="primary"
                            :label="t('block.reason')"
                            :rules="[requiredRule]"
                        />
                    </VCardText>
                    <VCardActions>
                        <VSpacer />
                        <VBtn
                            @click="displayBlockDialog = false"
                        >
                            {{ t('form.cancel') }}
                        </VBtn>
                        <VBtn
                            color="red"
                            prepend-icon="mdi-cancel"
                            type="submit"
                        >
                            {{ t('block.action') }}
                        </VBtn>
                    </VCardActions>
                </VForm>
            </VCard>
        </VDialog>
    </div>
</template>
