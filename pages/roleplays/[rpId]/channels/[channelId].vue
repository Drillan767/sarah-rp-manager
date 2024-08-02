<script setup lang="ts">
import type { CurrentUser } from '~/types/models'
import type { Database, Tables } from '~/types/supabase'

interface Props {
    roleplay: Tables<'roleplays'>
}

const props = defineProps<Props>()

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient<Database>()
const currentUser = useState<CurrentUser>('current-user')
const { t } = useI18n()

const channel = ref<Tables<'channels'>>()
const showDialog = ref(false)

const canEditDelete = computed(() => {
    if (!channel.value?.internal)
        return true

    return channel.value.internal && props.roleplay.user_id === currentUser.value.id
})

async function loadChannel() {
    const { data } = await supabase
        .from('channels')
        .select('*')
        .eq('id', route.params.channelId.toString())
        .single()

    if (data)
        channel.value = data
}

async function deleteChannel() {
    await useFetch('/api/channels/remove', {
        method: 'DELETE',
        body: {
            id: route.params.channelId.toString(),
        },
    })

    router.push(`/roleplays/${route.params.rpId.toString()}/channels`)

    showDialog.value = false
}

watch(() => route.params, (value) => {
    if (value.channelId) {
        loadChannel()
    }
}, { immediate: true })
</script>

<template>
    <VAppBar
        :title="channel?.name"
        flat
        tile
        class="border-b-sm"
    >
        <template #append>
            <VMenu location="bottom end">
                <template #activator="{ props: menu }">
                    <VBtn
                        v-bind="menu"
                        variant="flat"
                        icon="mdi-dots-horizontal"
                    />
                </template>
                <VList>
                    <VListItem
                        v-if="canEditDelete"
                        :title="t('form.edit_thing', { thing: t('fields.name') })"
                        prepend-icon="mdi-square-edit-outline"
                    />
                    <VListItem
                        v-if="canEditDelete"
                        :title="t('pages.channels.delete_title')"
                        @click="showDialog = true"
                    >
                        <template #prepend>
                            <VIcon
                                color="error"
                                icon="mdi-trash-can-outline"
                            />
                        </template>
                    </VListItem>
                </VList>
            </VMenu>
        </template>
    </VAppBar>
    <p>Détail du channel</p>

    <VDialog
        v-model="showDialog"
        width="960"
    >
        <VCard
            :title="t('form.remove_thing', { thing: channel?.name })"
            :text="t('pages.channels.delete_message')"
        >
            <template #actions>
                <VSpacer />
                <VBtn
                    @click="showDialog = false"
                >
                    {{ t('form.cancel') }}
                </VBtn>
                <VBtn
                    color="red"
                    @click="deleteChannel"
                >
                    {{ t('form.delete') }}
                </VBtn>
            </template>
        </VCard>
    </VDialog>
</template>
