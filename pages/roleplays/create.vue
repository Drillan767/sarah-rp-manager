<script setup lang="ts">
import type { CurrentUser } from '~/types/models'

interface FormType {
    title: string
    start_date: string | null
    description: string
    public: boolean
    illustration: File | undefined
}

const router = useRouter()

const currentUser = useState<CurrentUser | undefined>('current-user')

if (!currentUser.value)
    router.push('/')

const { t } = useI18n()

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
    if (!currentUser.value)
        return

    loading.value = true

    try {
        const { title, public: isPublic, start_date, description, illustration } = form.value

        if (!illustration)
            return

        loading.value = true

        const formData = new FormData()
        formData.append('title', title)
        formData.append('public', isPublic ? '1' : '0')
        if (start_date && start_date !== 'Invalid Date')
            formData.append('start_date', start_date)
        formData.append('description', description)
        formData.append('illustration', illustration)
        formData.append('description', description)
        formData.append('user_id', currentUser.value.id.toString())

        // Stores RP and illustration.
        const { data, error } = await useFetch('/api/rp/create', {
            method: 'POST',
            body: formData,
        })

        if (error)
            throw new Error(error.value?.message)

        // Store related roles.
        await useFetch('/api/roles/create', {
            method: 'POST',
            body: roles.value.map(r => ({
                ...r,
                roleplay_id: data.value,
            })),
        })

        await router.push(`/roleplays/${data.value}/edit?created=1`)
    }
    catch (e: any) {
        console.warn(e.message)
    }
    finally {
        loading.value = false
    }
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

/* Enable delete for user based on user_id
  (EXISTS ( SELECT count(*) AS count
   FROM (((characters c
     JOIN users cu ON ((c.user_id = cu.id)))
     JOIN roles cr ON ((c.role_id = cr.id)))
     JOIN users cru ON ((c.user_id = cru.id)))
  WHERE ((cru.session_id = auth.uid()) OR (cu.session_id = auth.uid()))))
*/

/* Enable update for rp's creator or related user
  (EXISTS ( SELECT count(*) AS count
   FROM (((characters c
     JOIN users cu ON ((c.user_id = cu.id)))
     JOIN roles cr ON ((c.role_id = cr.id)))
     JOIN users cru ON ((c.user_id = cru.id)))
  WHERE ((cru.session_id = auth.uid()) OR (cu.session_id = auth.uid()))))
*/
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
