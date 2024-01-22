<script setup lang="ts">
import type { Channel, Role, Roleplay } from '~/types/models'
import type { Database } from '~/types/supabase'
import useSnackBar from '~/composables/snackbar'

interface EditForm {
    title: string
    start_date: string | null
    illustration: File[] | undefined
    description: string
    public: boolean
}

type EditRoleplay = Omit<Roleplay, 'roles'>

const supabase = useSupabaseClient<Database>()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { showSuccess } = useSnackBar()
const { params } = route

const tabs = ref(2)
const loadingRP = ref(false)
const loadingRoles = ref(false)
const loadingChannels = ref(false)
const loadingDeletion = ref(false)
const displayRpDeleteModale = ref(false)
const displayRoleDeleteModale = ref(false)
const roles = ref<Role[]>([])
const roleDeleting = ref<Role>({} as Role)
const roleplay = ref<EditRoleplay>({} as EditRoleplay)
const channels = ref<Channel[]>([])
const form = ref<EditForm>({
    title: '',
    start_date: null,
    illustration: undefined,
    description: '',
    public: true,
})

useHead({
    title: () => `${t('form.edit')} ${roleplay.value?.title ?? ''}`,
})

onMounted(async () => {
    await fetchRP()
    await fetchRoles()
    await fetchChannels()
})

function handleRoleDeletion(role: Role) {
    roleDeleting.value = role
    displayRoleDeleteModale.value = true
}

async function deleteRoleplay() {
    loadingDeletion.value = true
    await useFetch('/api/rp/remove', {
        method: 'DELETE',
        body: {
            id: roleplay.value.id,
        },
    })

    loadingDeletion.value = false
    await router.push('/my-roleplays')
}

async function deleteRole() {
    loadingRoles.value = true
    await useFetch('/api/roles/remove', {
        body: {
            id: roleDeleting.value.id,
        },
        method: 'DELETE',
    })

    displayRoleDeleteModale.value = false
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
        form.value = Object.assign({}, {
            title: data.title,
            start_date: data.start_date,
            description: data.description,
            public: data.public,
            illustration: undefined,
        })
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

async function fetchChannels() {
    loadingChannels.value = true
    channels.value = []
    const { data } = await supabase
        .from('channels')
        .select('*')
        .eq('roleplay_id', params.id)

    if (data)
        channels.value = data

    loadingChannels.value = false
}

async function saveRP() {
    loadingRP.value = true

    const { title, public: isPublic, start_date, description, illustration } = form.value

    const formData = new FormData()
    formData.append('id', roleplay.value.id)
    formData.append('title', title)
    formData.append('public', isPublic ? '1' : '0')
    if (start_date)
        formData.append('start_date', start_date)
    formData.append('description', description)
    if (illustration)
        formData.append('illustration', illustration[0])
    formData.append('description', description)

    await useFetch('/api/rp/update', {
        method: 'POST',
        body: formData,
    })

    loadingRP.value = false

    showSuccess(t('form.updateConfirmed', { thing: t('pages.roleplays.self', 1) }))
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

    loadingRoles.value = false
    showSuccess(t('form.updateConfirmed', { thing: t('pages.roleplays.form.role', 1) }))

    await fetchChannels()
}

async function updateChannels() {
    loadingChannels.value = true
    await useFetch('/api/channels/update', {
        method: 'POST',
        body: channels.value,
    })

    loadingChannels.value = false
    showSuccess(t('form.updateConfirmed', { thing: t('pages.roleplays.channel.self', 1) }))

    await fetchChannels()
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
            <VCol cols="12" md="6">
                <h1 class="text-h3 mb-4">
                    <template v-if="roleplay.title">
                        {{ `${t('form.edit')} "${roleplay.title}"` }}
                    </template>
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
            </VCol>
        </VRow>
        <RPMessageBoardForm
            v-model:message="roleplay.message_board"
            :roleplay-id="roleplay.id"
        />
        <VRow>
            <VCol>
                <RpForm
                    :loading="loadingRP"
                    :current-preview="roleplay.illustration"
                    :form="form"
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
        <VRow>
            <VCol>
                <RPChannelsForm
                    v-model:loading="loadingChannels"
                    :roleplay-id="roleplay.id"
                    :channels="channels"
                    @update="updateChannels"
                    @fetch="fetchChannels"
                />
            </VCol>
        </VRow>
        <div class="d-flex justify-end my-4 gap-4">
            <VBtn
                color="red"
                @click.prevent="displayRpDeleteModale = true"
            >
                {{ t('form.delete') }}
            </VBtn>
        </div>
        <VDialog
            v-model="displayRpDeleteModale"
            width="800"
        >
            <VCard
                :title="t('pages.roleplays.delete.rp')"
                :text="t('pages.roleplays.delete.rp_message')"
            >
                <template #actions>
                    <VSpacer />
                    <VBtn
                        @click="displayRpDeleteModale = false"
                    >
                        {{ t('form.cancel') }}
                    </VBtn>
                    <VBtn
                        color="red"
                        @click="deleteRoleplay"
                    >
                        {{ t('form.delete') }}
                    </VBtn>
                </template>
            </VCard>
        </VDialog>
        <VDialog
            v-model="displayRoleDeleteModale"
            width="800"
        >
            <VCard
                :title="t('pages.roleplays.delete.role')"
                :text="t('pages.roleplays.delete.role_message')"
            >
                <template #actions>
                    <VSpacer />
                    <VBtn
                        :disabled="loadingDeletion"
                        @click="displayRoleDeleteModale = false"
                    >
                        {{ t('form.cancel') }}
                    </VBtn>
                    <VBtn
                        color="red"
                        :disabled="loadingDeletion"
                        :loading="loadingDeletion"
                        @click="deleteRole"
                    >
                        {{ t('form.delete') }}
                    </VBtn>
                </template>
            </VCard>
        </VDialog>
    </VContainer>
</template>
