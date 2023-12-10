<script setup lang="ts">
import type { Database } from '~/types/supabase'
import { useCurrentUser } from '~/composables/currentUser'

interface Roleplay {
    id: string
    illustration: string
    title: string
    start_date: string | null
}

const currentUser = useCurrentUser()
const supabase = useSupabaseClient<Database>()

const rpList = ref<Roleplay[]>([])
const blacklistedRPs = ref<string[]>([])

onMounted(() => fetch())

watch(currentUser, async () => {
    const { data: bl } = await supabase
        .from('blacklists')
        .select('roleplay_id')
        .eq('user_id', currentUser.value.id)

    blacklistedRPs.value = bl?.map(bl => bl.roleplay_id) ?? []
})

const availableRPs = computed(() => rpList.value.filter(r => !blacklistedRPs.value.includes(r.id)))

async function fetch() {
    const { data: rp } = await supabase
        .from('roleplays')
        .select(`
            id,
            title,
            illustration,
            start_date
        `)
        .eq('public', true)

    rpList.value = rp ?? []
}

useHead({
    title: 'Roleplays',
})
</script>

<template>
    <VContainer>
        <VRow>
            <VCol
                v-for="(rp, i) in availableRPs"
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
                </VCard>
            </VCol>
        </VRow>
    </VContainer>
</template>
