<script setup lang="ts">
import type { Database } from '~/types/supabase'
import type { CurrentUser } from '~/types/models'

interface Roleplay {
    id: string
    illustration: string
    title: string
    start_date: string | null
}

const { t } = useI18n()
const supabase = useSupabaseClient<Database>()
const currentUser = useState<CurrentUser | undefined>('current-user')
const selectedRP = ref<Roleplay>()
const showDeleteModal = ref(false)

const roleplays = ref<Roleplay[]>([])

useHead({
    title: t('pages.roleplays.my'),
})

async function loadRoleplays() {
    if (!currentUser.value)
        return

    const { data } = await supabase
        .from('roleplays')
        .select(`
            id,
            title,
            illustration,
            start_date
        `)
        .eq('user_id', currentUser.value.id)

    if (data)
        roleplays.value = data
}

function showModal(rp: Roleplay) {
    selectedRP.value = rp
    showDeleteModal.value = true
}

async function deleteRP(rpId: string) {
    await useFetch('/api/rp/remove', {
        method: 'DELETE',
        body: {
            rpId,
        },
    })

    selectedRP.value = undefined
    showDeleteModal.value = false

    await loadRoleplays()
}

onMounted(loadRoleplays)
</script>

<template>
    <VContainer>
        <VRow>
            <VCol class="d-flex flex-column flex-md-row justify-space-between">
                <h1 class="mb-2">
                    {{ t('pages.roleplays.my') }}
                </h1>
                <VBtn
                    prepend-icon="mdi-plus"
                    variant="outlined"
                    to="/roleplays/create"
                >
                    {{ t('pages.roleplays.create') }}
                </VBtn>
            </VCol>
        </VRow>
        <VRow>
            <VCol
                v-for="(rp, i) in roleplays"
                :key="i"
                cols="12"
                md="3"
            >
                <VCard :to="`/roleplays/${rp.id}`">
                    <VImg
                        :src="rp.illustration"
                        :cover="true"
                        height="250"
                    />
                    <VCardTitle>
                        {{ rp.title }}
                    </VCardTitle>
                    <VCardActions class="justify-end">
                        <VBtn
                            variant="text"
                            color="red"
                            icon="mdi-trash-can-outline"
                            @click.prevent="showModal(rp)"
                        />
                    </VCardActions>
                </VCard>
            </VCol>
        </VRow>
    </VContainer>
    <VDialog
        v-if="selectedRP"
        v-model="showDeleteModal"
        width="600"
    >
        <VCard
            :title="`${t('form.remove_thing', { thing: selectedRP.title })}?`"
            :text="t('pages.roleplays.delete_message')"
        >
            <template #prepend>
                <VIcon
                    icon="mdi-trash-can-outline"
                    color="red"
                />
            </template>
            <template #actions>
                <VSpacer />
                <VBtn
                    variant="flat"
                    color="red"
                    @click.prevent="deleteRP(selectedRP.id)"
                >
                    {{ t('form.remove') }}
                </VBtn>
            </template>
        </VCard>
    </VDialog>
</template>
