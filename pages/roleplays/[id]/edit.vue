<script setup lang="ts">
import type { Role, Roleplay } from '~/types/models'
import type { Database } from '~/types/supabase'
import useSnackBar from '~/composables/snackbar'

interface EditForm {
    id: number
    title: string
    start_date: string | null
    description: string
    illustration: File | undefined
}

type EditRoleplay = Omit<Roleplay, 'roles'>

const supabase = useSupabaseClient<Database>()
const route = useRoute()
const { t } = useI18n()
const { showSuccess } = useSnackBar()
const { params } = route

// const tabs = ref(2)
const loadingRP = ref(false)
const loadingRoles = ref(false)
const displayDeleteModale = ref(false)
const rpValid = ref(false)
const roles = ref<Role[]>([])
const roleDeleting = ref<Role>({} as Role)
const roleplay = ref<EditRoleplay>({} as EditRoleplay)
const form = ref<EditForm>()

useHead({
    title: () => `${t('form.edit')} ${roleplay.value?.title ?? ''}`,
})

onMounted(async () => {
    await fetchRP()
    await fetchRoles()
})

function handleRoleDeletion(role: Role) {
    roleDeleting.value = role
    displayDeleteModale.value = true
}

async function deleteRoleplay() {
    await useFetch('/api/rp/remove', {
        method: 'DELETE',
        body: {
            id: roleplay.value.id,
        },
    })
}

async function deleteRole() {
    loadingRoles.value = true
    await useFetch('/api/roles/remove', {
        body: {
            id: roleDeleting.value.id,
        },
        method: 'DELETE',
    })

    displayDeleteModale.value = false
    roles.value = roles.value.filter(r => r.id !== roleDeleting.value.id)
    loadingRoles.value = false

    showSuccess(t('form.deleteConfirmed', { thing: t('pages.roleplays.form.role', 1) }))
}

async function fetchRP() {
    loadingRP.value = true
    const { data } = await supabase
        .from('roleplays')
        .select('*')
        .eq('id', params.id)
        .single()

    if (data) {
        roleplay.value = data

        const payload: EditForm = {
            id: data.id,
            title: data.title,
            start_date: data.start_date,
            description: data.description,
            illustration: undefined,
        }

        form.value = payload

        /*         form.value = {
            title: data.title,
            start_date: data.start_date,
            description: data.description,
            illustration: data.illustration as File | undefined,
        } as EditForm */
    }

    loadingRP.value = false
}

async function fetchRoles() {
    loadingRoles.value = true
    const { data } = await supabase
        .from('roles')
        .select('*')
        .eq('roleplay_id', params.id)

    if (data)
        roles.value = data

    loadingRoles.value = false
}

async function saveRP() {
    if (!form.value)
        return
    loadingRP.value = true

    const { title, start_date, description, illustration } = form.value

    const formData = new FormData()
    formData.append('id', roleplay.value.id)
    formData.append('title', title)
    if (start_date)
        formData.append('start_date', start_date)
    formData.append('description', description)
    if (illustration)
        formData.append('illustration', illustration)
    formData.append('description', description)

    await useFetch('/api/rp/update', {
        method: 'POST',
        body: formData,
    })

    loadingRP.value = false
}

async function updateRoles() {
    loadingRoles.value = true

    await useFetch('/api/roles/update', {
        method: 'POST',
        body: roles.value.map(r => ({
            ...r,
            roleplay_id: roleplay.value.id,

        })),
    })

    await fetchRoles()

    loadingRoles.value = false
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
        title: t('form.edit'),
    },
]))
</script>

<template>
    <VContainer>
        <VRow>
            <VCol>
                <Breadcrumb
                    :links="links"
                />
            </VCol>
        </VRow>
        <VRow>
            <VCol>
                <h1 class="text-h3 mb-4">
                    <template v-if="roleplay.title">
                        {{ `${t('form.edit')} "${roleplay.title}"` }}
                    </template>
                </h1>
            </VCol>
            <!-- <VCol
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
                        :to="`/roleplays/${roleplay.id}/edit`"
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
            </VCol> -->
        </VRow>
        <RPMessageBoardForm
            v-model:message="roleplay.message_board"
            :roleplay-id="roleplay.id"
        />
        <VRow>
            <VCol>
                <RpForm
                    v-if="form"
                    v-model:form="form"
                    v-model:valid="rpValid"
                    :loading="loadingRP"
                    :current-preview="roleplay.illustration"
                    :edit="true"
                    @save="saveRP"
                />
            </VCol>
        </VRow>
        <VRow>
            <VCol>
                <RpRolesForm
                    v-model:roles="roles"
                    :loading="loadingRoles"
                    :edit="true"
                    @update="updateRoles"
                    @delete="handleRoleDeletion"
                />
            </VCol>
        </VRow>
        <div class="d-flex justify-end my-4 gap-4">
            <VBtn
                color="red"
                @click.prevent="deleteRoleplay"
            >
                {{ t('form.delete') }}
            </VBtn>
        </div>
        <VDialog
            v-model="displayDeleteModale"
            width="800"
        >
            <VCard>
                <template #title>
                    {{ t('pages.roleplays.delete.role') }}
                </template>
                <template #text>
                    {{ t('pages.roleplays.delete.role_message') }}
                </template>
                <template #actions>
                    <VSpacer />
                    <VBtn
                        @click="displayDeleteModale = false"
                    >
                        {{ t('form.cancel') }}
                    </VBtn>
                    <VBtn
                        color="red"
                        @click="deleteRole"
                    >
                        {{ t('form.delete') }}
                    </VBtn>
                </template>
            </VCard>
        </VDialog>
    </VContainer>
</template>
