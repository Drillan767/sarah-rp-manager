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

const roleplays = ref<Roleplay[]>([])

useHead({
    title: t('pages.roleplays.navlink'),
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

onMounted(loadRoleplays)

/* watch(currentUser, async (value) => {
    if (value.id && value.id !== 0) {
        const { data } = await supabase
            .from('roleplays')
            .select(`
                id,
                title,
                illustration,
                public,
                start_date
            `)
            .eq('user_id', value.id)

        if (data)
            roleplays.value = data
    }
}) */
</script>

<template>
    <VContainer>
        <VRow>
            <VCol class="d-flex flex-column flex-md-row justify-space-between">
                <h1 class="mb-2">
                    {{ t('pages.roleplays.navlink') }}
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
                        height="250"
                        :cover="true"
                    />
                    <VCardTitle>
                        {{ rp.title }}
                    </VCardTitle>
                    <VCardActions class="justify-end">
                        <VBtn
                            variant="text"
                            color="red"
                            icon="mdi-trash-can-outline"
                        />
                    </VCardActions>
                </VCard>
            </VCol>
        </VRow>
    </VContainer>
</template>
