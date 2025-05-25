<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    links: {
        title: string
        to?: string
    }[]
}

const props = defineProps<Props>()

const items = computed(() => {
    return props.links.map((link, i, row) => ({
        title: link.title,
        to: link.to,
        disabled: i + 1 === row.length,
    }))
})
</script>

<template>
    <VBreadcrumbs :items="items">
        <template #divider>
            <VIcon icon="mdi-chevron-right" />
        </template>
    </VBreadcrumbs>
</template>
