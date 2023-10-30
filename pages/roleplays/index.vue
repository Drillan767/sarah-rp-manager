<script setup lang="ts">
import type { Database } from '~/types/supabase'
import type { DataTableHeader } from '~/types/models'
import { useCurrentUser } from '@/composables/currentUser'
import useSnackBar from '~/composables/snackbar'

const supabase = useSupabaseClient<Database>()
const currentUser = useCurrentUser()
const { t } = useI18n()
const dayjs = useDayjs()

const { showError } = useSnackBar()

const roleplays = ref<any[]>([])
const expanded = ref([])

useHead({
    title: 'Roleplays'
})

if (currentUser.value.id === 0) {
    throw createError({
        statusCode: 404,
        statusMessage: t('common.notfound'),
        fatal: true,
    })
}

const { data, error } = await supabase
    .from('roleplays')
    .select('id, title, description, message_board, start_date, public, created_at, user_id, illustration')
    .eq('user_id', currentUser.value.id)

if (error || !data) {
    showError(error.message)
}

if (data) roleplays.value = data

const links = [
    {
        title: t('pages.home'),
        to: '/'
    },
    {
        title: t('pages.roleplays.navlink')
    }
]

const headers: DataTableHeader[] = [
    { title: t('common.title'), align: 'start', key: 'title' },
    { title: 'Public', align: 'end', key: 'public' },
    { title: t('pages.roleplays.start_date'), align: 'end', key: 'start_date' },
    { title: t('common.created_at'), align: 'end', key: 'created_at' },
    { title: 'Actions', align: 'end', key: 'actions' },
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
            <VCol>
                <h1 class="text-h3 mb-4">{{ t('pages.roleplays.navlink') }}</h1>
            </VCol>
            <VCol class="d-flex align-center justify-end">
                <VBtn
                    color="primary"
                    to="/roleplays/create"
                >
                    {{ t('pages.roleplays.create') }}
                </VBtn>
            </VCol>
        </VRow>
        <VRow>
            <VCol>
                <VCard>
                    <VCardText>
                        <VDataTable
                            :headers="headers"
                            :items="roleplays"
                            v-model:expanded="expanded"
                            :show-expand="true"
                            item-value="name"
                        >
                            <template #expanded-row="{ columns, item }">
                                <tr>
                                    <td :colspan="columns.length" v-html="item.description" />
                                </tr>
                            </template>
                            <template #item.public="{ value }">
                                <VChip
                                    :color="value ? 'green' : 'red'"
                                >
                                    {{ value ? 'Public': t('common.private') }}
                                </VChip>
                            </template>
                            <template #item.start_date="{ value }">
                                {{ value ? dayjs(value).format('DD/MM/YYYY') : 'N/A' }}
                            </template>
                            <template #item.created_at="{ value }">
                                {{ dayjs(value).format('DD/MM/YYYY') }}
                            </template>
                            <template #item.actions="{ item }">
                                <VBtn
                                    variant="tonal"
                                    icon="mdi-eye-arrow-right-outline"
                                    color="blue"
                                    class="mr-2"
                                    :to="`/roleplays/${item.id}`"
                                />
                                <VBtn
                                    variant="tonal"
                                    color="orange"
                                    icon="mdi-book-edit"
                                    class="mr-2"
                                    :to="`/roleplays/${item.id}/edit`"
                                />
                                <VBtn
                                    variant="tonal"
                                    color="red"
                                    icon="mdi-trash-can-outline"
                                />
                            </template>
                        </VDataTable>
                    </VCardText>
                </VCard>
            </VCol>
        </VRow>
    </VContainer>
</template>

