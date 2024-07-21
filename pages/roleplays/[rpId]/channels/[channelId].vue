<script setup lang="ts">
import type { Database, Tables } from '~/types/supabase'

const route = useRoute()
const supabase = useSupabaseClient<Database>()

const channel = ref<Tables<'channels'>>()

async function loadChannel(channelId: string) {
    const { data } = await supabase
        .from('channels')
        .select('*')
        .eq('id', channelId)
        .single()

    if (data)
        channel.value = data
}

watch(() => route.params, (value) => {
    if (value.channelId) {
        loadChannel(value.channelId.toString())
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
                        title="Modifier le nom"
                        prepend-icon="mdi-square-edit-outline"
                    />
                    <VListItem
                        title="Supprimer le canal"
                        @click="() => console.log('bjr')"
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
</template>
