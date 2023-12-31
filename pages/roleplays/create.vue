<script setup lang="ts">
import { useCurrentUser } from '~/composables/currentUser'

interface FormType {
    title: string
    start_date: string
    description: string
    public: boolean
    illustration: File[] | undefined
}

const { t } = useI18n()
const currentUser = useCurrentUser()
const router = useRouter()

useHead({
    title: t('pages.roleplays.create'),
})

const form = ref<FormType>({
    title: '',
    start_date: '',
    description: '',
    public: true,
    illustration: undefined,
})

const roles = ref([
    {
        name: '',
        max_users: 1,
        description: '',
        roleplay_id: '',

    },
])

const loading = ref(false)

async function submit() {
    const { title, public: isPublic, start_date, description, illustration } = form.value

    if (!illustration)
        return

    loading.value = true

    const formData = new FormData()
    formData.append('title', title)
    formData.append('public', isPublic ? '1' : '0')
    formData.append('start_date', start_date)
    formData.append('description', description)
    formData.append('illustration', illustration[0])
    formData.append('description', description)
    formData.append('user_id', currentUser.value.id.toString())

    // Stores RP and illustration.
    const { data } = await useFetch('/api/rp/create', {
        method: 'POST',
        body: formData,
    })

    // Store related roles.
    await useFetch('/api/roles/create', {
        method: 'POST',
        body: roles.value.map(r => ({
            ...r,
            roleplay_id: data.value,
        })),
    })

    loading.value = false

    await router.push(`/roleplays/${data.value}/edit?created=1`)
}

const links = [
    {
        title: t('pages.home'),
        to: '/',
    },
    {
        title: t('pages.roleplays.navlink'),
        to: '/roleplays',
    },
    {
        title: t('pages.roleplays.create'),
    },
]
</script>

<template>
    <VContainer>
        <VForm @submit.prevent="submit">
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
                        {{ t('pages.roleplays.create') }}
                    </h1>
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <RpForm
                        v-model:form="form"
                        :loading="loading"
                        :edit="false"
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <RpRolesForm
                        v-model:roles="roles"
                        :loading="loading"
                        :edit="false"
                    />
                </VCol>
            </VRow>
            <div class="d-flex justify-end my-4">
                <VBtn
                    color="primary"
                    type="submit"
                    :disabled="loading"
                >
                    {{ t('form.save') }}
                </VBtn>
            </div>
        </VForm>
    </VContainer>
</template>
