<script setup lang="ts">
import {
    BaseKit,
    Blockquote,
    Bold,
    BulletList,
    Fullscreen,
    History,
    Heading,
    Italic,
    OrderedList,
    Strike,
    Underline,
    VuetifyTiptap,
} from 'vuetify-pro-tiptap'
import 'vuetify-pro-tiptap/style.css'

defineProps<{ title: string }>()

const content = defineModel<string>('content', { required: true })

const extensions = [
    BaseKit.configure({
        placeholder: {
            placeholder: 'Entrez du texte...',
        },
    }),
    Blockquote,
    Bold,
    Heading.configure({
        levels: [1, 2, 3, 4],
        divider: true,
    }),
    Italic,
    Underline,
    Strike,
    BulletList,
    OrderedList,
    Fullscreen,
    History,
]
</script>

<template>
    <VApp id="app">
        <VContainer>
            <VuetifyTiptap
                v-model="content"
                :label="title"
                rounded
                :min-height="200"
                :max-height="465"
                :max-width="900"
                :extensions="extensions"
            />
        </VContainer>
    </VApp>
</template>

<style scoped>
:deep(.v-application__wrap) {
    min-height: auto;
}
</style>
