<script setup lang="ts">
import type { Database, Tables } from '~/types/supabase'
import type { CurrentUser } from '~/types/models'

interface Roleplay {
    id: string
    illustration: string
    title: string
    start_date: string | null
}

const roleplays = ref<Roleplay[]>([])

const { t } = useI18n()
const supabase = useSupabaseClient<Database>()

useHead({
    title: t('pages.roleplays.browse'),
})

async function loadRoleplays() {
    const { data } = await supabase
        .from('roleplays')
        .select(`
            id,
            title,
            illustration,
            start_date
        `)

    if (data)
        roleplays.value = data
}

onMounted(loadRoleplays)
</script>

<template>
    <VContainer>
        <VRow>
            <VCol class="d-flex flex-column flex-md-row justify-space-between">
                <h1 class="mb-2">
                    {{ t('pages.roleplays.browse') }}
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
                </VCard>
            </VCol>
        </VRow>
    </VContainer>
</template>
