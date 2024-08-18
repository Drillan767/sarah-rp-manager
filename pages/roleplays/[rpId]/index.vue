<script setup lang="ts">
import useSnackBar from '~/composables/snackbar'
import type { CurrentUser } from '~/types/models'
import type { Database, Tables } from '~/types/supabase'

// import RpRegisterForm from '~/components/rp/RpRegisterForm.vue'

type RoleCharacter = Tables<'roles'> & {
    characters: {
        id: number
    }[]
}

type RPDetail = Tables<'roleplays'> & {
    roles: RoleCharacter[]
    user: {
        id: string
        username: string
    } | null
}

const currentUser = useState<CurrentUser | undefined>('current-user')
const supabase = useSupabaseClient<Database>()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { showError } = useSnackBar()

const { query, params } = route

const created = ref(false)
const updated = ref(false)
const roleplay = ref<RPDetail>({} as RPDetail)

const { data: rpData, error } = await supabase
    .from('roleplays')
    .select(`
        *,
        roles(
            *,
            characters(id)
        ),
        user:users(id, username)
    `)
    .eq('id', params.rpId)
    .single()

if (error || rpData === null) {
    router.push('/all-roleplays')
        .then(() => showError('Roleplay not found'))
}

if (rpData)
    roleplay.value = rpData

useHead({
    title: roleplay.value.title,
})

onMounted(() => {
    if ('created' in query)
        created.value = true
    else if ('updated' in query)
        updated.value = true
})

function getAvailableSlots(max: number, current: number) {
    const total = max - current

    return total < 9
        ? `mdi-numeric-${total}-circle`
        : 'mdi-numeric-9-plus-circle'
}
</script>

<template>
    <div>
        <VImg
            :src="roleplay.illustration"
            class="align-end"
            height="400"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            :cover="true"
        >
            <VCardTitle class="text-white text-center text-h3">
                {{ roleplay.title }}
            </VCardTitle>
        </VImg>

        <VContainer>
            <div class="d-flex flex-column flex-md-row justify-space-between">
                <div class="meta mb-4 mb-md-0">
                    <p>{{ t('common.by') }} @{{ roleplay.user?.username }}</p>
                </div>
                <div>
                    <VBtn
                        :to="`/roleplays/${roleplay.id}/channels`"
                        color="green"
                        variant="outlined"
                        prepend-icon="mdi-login"
                    >
                        {{ t('pages.channels.access') }}
                    </VBtn>
                    <VBtn
                        v-if="currentUser?.id === roleplay?.user?.id"
                        color="orange"
                        variant="outlined"
                        prepend-icon="mdi-book-edit-outline"
                        :to="`/roleplays/${roleplay.id}/edit`"
                        class="ml-4"
                    >
                        {{ t('form.edit') }}
                    </VBtn>
                </div>
            </div>

            <VDivider class="my-4" />

            <template v-if="roleplay.message_board && roleplay.message_board !== ''">
                <VAlert
                    type="info"
                    title="Information"
                    :text="roleplay.message_board"
                    class="mb-4"
                />
            </template>

            <div v-html="roleplay.description" />
        </VContainer>
        <VDivider class="my-4" />
        <VContainer>
            <VRow>
                <VCol>
                    <h2 class="text-h4">
                        {{ t('pages.roleplays.nbRoles', roleplay.roles.length) }}
                    </h2>
                </VCol>
            </VRow>
            <VRow>
                <VCol
                    v-for="(role, i) in roleplay.roles"
                    :key="i"
                    cols="12"
                    md="3"
                >
                    <VCard
                        :title="role.name"
                        :text="role.description"
                        class="h-100 d-flex flex-column"
                    >
                        <template #actions>
                            <VSpacer />
                            <VChip
                                :prepend-icon="getAvailableSlots(role.max_users, role.characters.length)"
                                variant="outlined"
                                color="blue"
                            >
                                {{ t('pages.roles.nb', getAvailableSlots(role.max_users, role.characters.length)) }}
                            </VChip>
                        </template>
                    </VCard>
                </VCol>
            </VRow>
        </VContainer>
        <!-- <RpRegisterForm
            :roleplay="roleplay"
            :show="showRegistrationModale"
            @close="showRegistrationModale = false"
        /> -->
    </div>
</template>
