<script setup lang="ts">
import type { CurrentUser, Roleplay } from '~/types/models'
import type { Database } from '~/types/supabase'
// import RpRegisterForm from '~/components/rp/RpRegisterForm.vue'

interface RPDetail extends Omit<Roleplay, 'roles'> {
    roles: {
        id: number
        name: string
        description: string
        max_users: number
        characters: any[]
    }[]
    user: {
        session_id: string
        username: string
    } | null
}

const currentUser = useState<CurrentUser | undefined>('current-user')
const supabase = useSupabaseClient<Database>()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

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
            characters(count)
        ),
        user:users(session_id, username)
    `)
    .eq('id', params.rpId)
    .single()

if (error || rpData === null)
    await router.push('/?notfound=1')

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
            <div class="d-flex justify-space-between align-center">
                <div class="meta">
                    <p>{{ t('common.by') }} @{{ roleplay.user?.username }}</p>
                </div>
                <div>
                    <!-- @click="showRegistrationModale = true" -->
                    <VBtn
                        :to="`/roleplays/${roleplay.id}/channels`"
                        color="green"
                        variant="outlined"
                        prepend-icon="mdi-login"
                    >
                        {{ t('pages.roleplays.channel.access') }}
                    </VBtn>
                    <VBtn
                        v-if="currentUser?.id === roleplay?.user?.session_id"
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
                        {{ t('pages.roleplays.form.role', 2) }}
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
                        class="h-100 d-flex flex-column"
                    >
                        <VCardTitle>
                            {{ role.name }}
                        </VCardTitle>
                        <VCardText>
                            {{ role.description }}
                        </VCardText>
                        <VCardActions>
                            <VSpacer />
                            <VChip
                                :prepend-icon="getAvailableSlots(role.max_users, role.characters[0].count)"
                                variant="outlined"
                                color="blue"
                            >
                                {{ t('pages.roles.nb', getAvailableSlots(role.max_users, role.characters[0].count)) }}
                            </VChip>
                        </VCardActions>
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
