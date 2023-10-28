<script setup lang="ts">
import type { Roleplay, Role } from '~/types/models'
import type { Database } from '~/types/supabase'
import useSnackBar from '~/composables/snackbar'
import { useCurrentUser } from '@/composables/currentUser'

interface EditForm {
    title: string,
    start_date: string | null,
    illustration: File | null,
    description: string,
    public: boolean,
}

const supabase = useSupabaseClient<Database>()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { showSuccess } = useSnackBar()
const currentUser = useCurrentUser()
const { params } = route

const tabs = ref(2)
const loading = ref(false)
const displayDeleteModale = ref(false)
const roleDeleting = ref<Role>({} as Role)
const roleplay = ref<Roleplay>({} as Roleplay)
const form = ref<EditForm>({
    title: '',
    start_date: null,
    illustration: null,
    description: '',
    public: true,
})

/* if (currentUser.value.id === 0) {
    throw createError({
        statusCode: 404,
        statusMessage: t('common.notfound'),
        fatal: true,
    })
} */

loading.value = true
const { data, error } = await supabase
    .from('roleplays')
    .select(`*, roles(*)`)
    .eq('id', params.id)
    .single()

if (error || data === null || data.user_id !== currentUser.value.id) {
    await router.push('/?notfound=1')
}

if (data) {
    roleplay.value = data
    form.value = Object.assign({}, {
        title: data.title,
        start_date: data.start_date,
        description: data.description,
        public: data.public,
        illustration: null,
    })
}

loading.value = false

useHead({
    title: `${t('form.edit')} ${roleplay.value.title}`,
})

const submit = async() => {
    loading.value = true

    const { title, public: isPublic, start_date, description, illustration } = form.value

    const formData = new FormData()
    formData.append('id', roleplay.value.id)
    formData.append('title', title)
    formData.append('public', isPublic ? '1' : '0')
    if (start_date) formData.append('start_date', start_date)
    formData.append('description', description)
    if (illustration) formData.append('illustration', illustration)
    formData.append('description', description)

    await useFetch('/api/rp/update', {
        method: 'POST',
        body: formData,
    })

    await useFetch('/api/roles/update', {
        method: 'POST',
        body: roleplay.value.roles.map((r) => ({
            ...r,
            roleplay_id: roleplay.value.id,

        })),
    })

    loading.value = false

    showSuccess(t('form.updateConfirmed', { thing: t('pages.roleplays.self') }))
    await router.push(`/roleplays/${roleplay.value.id}?updated=1`)
}

const handleRoleDeletion = (role: Role) => {
    roleDeleting.value = role
    displayDeleteModale.value = true
}

const deleteRoleplay = async() => {
    await useFetch('/api/rp/remove', {
        method: 'DELETE',
        body: {
            id: roleplay.value.id,
        },
    })
}

const deleteRole = async() => {
    loading.value = true
    await useFetch('/api/roles/remove', {
        body: {
            id: roleDeleting.value.id,
        },
        method: 'DELETE',
    })

    displayDeleteModale.value = false
    roleplay.value.roles = roleplay.value.roles.filter((r) => r.id !== roleDeleting.value.id)
    loading.value = false

    showSuccess(t('form.deleteConfirmed', { thing: t('pages.roleplays.form.role', 1) }))
}

watch(form, (value) => {
    console.log(value)
    if (value.illustration) {
        console.log('new image just dropped')
    }
})

const links = [
    {
        title: t('pages.home'),
        to: '/'
    },
    {
        title: roleplay.value.title,
        to: `/roleplays/${roleplay.value.id}`
    },
    {
        title: t('form.edit'),
    }
]

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
                <h1 class="text-h3 mb-4">{{ `${t('form.edit')} "${roleplay.title}"` }}</h1>
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
                        Candidatures
                    </VTab>
                    <VTab
                        :to="`/roleplays/${roleplay.id}/edit`"
                        :value="2"
                    >
                        Editer
                    </VTab>
                    <VTab
                        :to="`/roleplays/${roleplay.id}`"
                        :value="3"
                    >
                        Voir
                    </VTab>
                </VTabs>
            </VCol>
        </VRow>
        <RPMessageBoardForm
            :roleplay-id="roleplay.id"
            :message="roleplay.message_board"
        />
        <VForm @submit.prevent="submit">
            <VRow>
                <VCol>
                    <RpForm
                        :loading="loading"
                        :current-preview="roleplay.illustration"
                        :form="form"
                        :edit="true"
                    />

                </VCol>
            </VRow>
            <VRow v-if="roleplay.roles">
                <VCol>
                    <RpRolesForm
                        :loading="loading"
                        :roles="roleplay.roles"
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
                <VBtn
                    color="primary"
                    type="submit"
                    :disabled="loading"
                >
                    {{ t('form.save') }}
                </VBtn>
            </div>
        </VForm>
        <VDialog
            v-model="displayDeleteModale"
            width="800"
        >
            <VCard>
                <VCardTitle>
                    {{ t('pages.roleplays.delete.role') }}
                </VCardTitle>
                <VCardText>
                    {{ t('pages.roleplays.delete.role_message') }}
                </VCardText>
                <VCardActions>
                    <VSpacer />
                    <VBtn
                        @click="displayDeleteModale = false"
                    >
                        {{ t('form.cancel') }}
                    </VBtn>
                    <VBtn
                        @click="deleteRole"
                        color="red"
                    >
                        {{ t('form.delete') }}
                    </VBtn>
                </VCardActions>
            </VCard>
        </VDialog>
    </VContainer>
</template>
