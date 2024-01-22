<script setup lang="ts">
interface Channel {
    id: number
    name: string
    roleplay_id: string
}

interface Props {
    channel: Channel
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'update:channel', value: Channel): void
    (e: 'delete'): void
}>()

const { t } = useI18n()

const { defineField, setValues } = useForm<Channel>({
    validationSchema: {
        name: 'required',

    },
    initialValues: props.channel,
})

const [name, nameProps] = defineField('name', vuetifyConfig)

watch(name, value => emit('update:channel', { ...props.channel, name: value }))

watch(() => props.channel, value => setValues(value))
</script>

<template>
    <VCol
        cols="12"
        md="4"
    >
        <VCard>
            <template #text>
                <VRow>
                    <VCol cols="10">
                        <VTextField
                            v-bind="nameProps"
                            v-model="name"
                            :label="t('pages.roleplays.form.channel_name')"
                        />
                    </VCol>
                    <VCol cols="2">
                        <VBtn
                            color="error"
                            icon="mdi-trash-can-outline"
                            variant="flat"
                            @click="emit('delete')"
                        />
                    </VCol>
                </VRow>
            </template>
        </VCard>
    </VCol>
</template>
