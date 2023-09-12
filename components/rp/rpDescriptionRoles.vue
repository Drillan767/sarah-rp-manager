<script setup lang="ts">
interface Role {
    id: number
    name: string
    max_users: number
    roleplay_id: string
}

interface Props {
    description?: string
    editable?: boolean
    roles?: Role[]
}

const props = withDefaults(defineProps<Props>(), {
    editable: false,
    roles: () => ([]),
})

const readableDescription = computed(() => {
    if (props.description)
        return props.description.replace(/(?:\r\n|\r|\n)/g, '<br>')
    return ''
})
</script>

<template>
    <div class="description-roles">
        <div class="description mb-4">
            <ClientOnly>
                <p v-html="readableDescription" />
            </ClientOnly>
        </div>
    </div>
</template>
