<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps<{ modelValue: any }>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void,
}>()

const editor = useEditor({
    content: '<p></p>',
    extensions: [
        StarterKit,
        Placeholder.configure({
            placeholder: 'Description...'
        })
    ],
    onUpdate: () => {
        emit('update:modelValue', editor.value?.getHTML())
    },
})

onMounted(() => editor.value?.commands.setContent(props.modelValue))

watch(() => props.modelValue, (value) => {
    const isSame = editor.value?.getHTML() === value

    if (isSame) return

    editor.value?.commands.setContent(value, false)
})

onBeforeUnmount(() => editor.value?.destroy())

</script>

<template>
    <div>
        <div v-if="editor" class="mb-4">
            <VBtnToggle
                variant="outlined"
                :divided="true"
                class="mr-4"
            >
                <VBtn size="small"  @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'v-btn--variant-outlined': editor.isActive('bold') }">
                    <VIcon icon="mdi-format-bold" />
                </VBtn>
                <VBtn size="small"  @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'v-btn--variant-outlined': editor.isActive('italic') }">
                    <VIcon icon="mdi-format-italic" />
                </VBtn>
                <VBtn size="small"  @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'v-btn--variant-outlined': editor.isActive('strike') }">
                    <VIcon icon="mdi-format-strikethrough-variant" />
                </VBtn>
                <VBtn size="small"  @click="editor.chain().focus().setParagraph().run()" :class="{ 'v-btn--variant-outlined': editor.isActive('paragraph') }">
                    <VIcon icon="mdi-format-paragraph" />
                </VBtn>
            </VBtnToggle>
            <VBtnToggle
                variant="outlined"
                :divided="true"
                class="mr-4"
            >
                <VBtn size="small"  @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'v-btn--variant-outlined': editor.isActive('heading', { level: 2 }) }">
                    h2
                </VBtn>
                <VBtn size="small"  @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'v-btn--variant-outlined': editor.isActive('heading', { level: 3 }) }">
                    h3
                </VBtn>
                <VBtn size="small"  @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'v-btn--variant-outlined': editor.isActive('heading', { level: 4 }) }">
                    h4
                </VBtn>
                <VBtn size="small"  @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'v-btn--variant-outlined': editor.isActive('heading', { level: 5 }) }">
                    h5
                </VBtn>
                <VBtn size="small"  @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'v-btn--variant-outlined': editor.isActive('heading', { level: 6 }) }">
                    h6
                </VBtn>
            </VBtnToggle>

            <VBtnToggle
                variant="outlined"
                :divided="true"
                class="mr-4"
            >
                <VBtn size="small"  @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'v-btn--variant-outlined': editor.isActive('bulletList') }">
                    <VIcon icon="mdi-format-list-bulleted" />
                </VBtn>
                <VBtn size="small"  @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'v-btn--variant-outlined': editor.isActive('orderedList') }">
                    <VIcon icon="mdi-format-list-numbered" />
                </VBtn>
                <VBtn size="small"  @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'v-btn--variant-outlined': editor.isActive('blockquote') }">
                    <VIcon icon="mdi-format-quote-close" />
                </VBtn>
                <VBtn size="small"  @click="editor.chain().focus().setHorizontalRule().run()">
                    <VIcon icon="mdi-minus" />
                </VBtn>
            </VBtnToggle>

            <VBtnToggle
                variant="outlined"
                :divided="true"
                class="mr-4"
            >
                <VBtn size="small"  @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
                    <VIcon icon="mdi-undo" />
                </VBtn>
                <VBtn size="small"  @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
                    <VIcon icon="mdi-redo" />
                </VBtn>
            </VBtnToggle>
        </div>
        <VCard
            variant="outlined"
        >
            <VCardText>
                <EditorContent :editor="editor" />
            </VCardText>
        </VCard>
    </div>
</template>

<style lang="scss">
/* Basic editor styles */
.tiptap {
    > * + * {
        margin-top: 0.75em;
    }

    ul,
    ol {
        padding: 0 1rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        line-height: 1.1;
    }

    code {
        background-color: rgba(#616161, 0.1);
        color: #616161;
    }

    pre {
        background: #0D0D0D;
        color: #FFF;
        font-family: 'JetBrainsMono', monospace;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;

        code {
            color: inherit;
            padding: 0;
            background: none;
            font-size: 0.8rem;
        }
    }

    img {
        max-width: 100%;
        height: auto;
    }

    blockquote {
        padding-left: 1rem;
        border-left: 2px solid rgba(#0D0D0D, 0.1);
    }

    hr {
        border: none;
        border-top: 2px solid rgba(#0D0D0D, 0.1);
        margin: 2rem 0;
    }

    p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        color: #adb5bd;
        pointer-events: none;
        height: 0;
    }
}
</style>
