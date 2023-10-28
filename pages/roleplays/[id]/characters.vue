<script setup lang="ts">
import type { Role, Character } from '~/types/models'
import type { Database } from '~/types/supabase'
import useSnackBar from '~/composables/snackbar'
import { useCurrentUser } from '@/composables/currentUser'

interface RoleplayData {
    id: string,
    title: string,
    roles: (Role & {
        characters: Character[]
    })[]
}

const supabase = useSupabaseClient<Database>()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { showSuccess } = useSnackBar()
const currentUser = useCurrentUser()
const { params } = route

const loading = ref(false)
const tabs = ref(1)
const roleplay = ref<RoleplayData>({} as RoleplayData)

/*
if (currentUser.value.id === 0) {
    throw createError({
        statusCode: 404,
        statusMessage: t('common.notfound'),
        fatal: true,
    })
}
*/


const fetch = async() => {
    loading.value = true

    const { data } = await supabase
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
                    status,
                    user:users(
                        id,
                        username
                    )
                )
            )
        `)
        .eq('roles.characters.status', 0)
        .eq('id', params.id)
        .single()

    if (data) {
        roleplay.value = data
    }

    loading.value = false

    console.log(data)
}

useHead({
    title: t('pages.roleplays.application.title'),
})

onMounted(() => fetch())


const links = computed(() => ([
    {
        title: t('pages.home'),
        to: '/'
    },
    {
        title: roleplay.value.title,
        to: `/roleplays/${roleplay.value.id}`
    },
    {
        title: t('pages.roleplays.application.title'),
    }
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
                <h1 class="text-h3 mb-4">{{ t('pages.roleplays.application.title') }}</h1>
            </VCol>
            <VCol
                cols="12"
                md="6"
                class="d-flex justify-end align-center"
            >
                <VTabs v-model="tabs">
                    <VTab
                        :to="`/roleplays/${roleplay.id}/pending`"
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
    </VContainer>
</template>