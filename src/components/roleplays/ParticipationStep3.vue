<script setup lang="ts">
import type { ListTemplatesForUserData } from '@sarah-rp-manager/default-connector'
import type { UpdateTemplateFormType } from '@/types/forms'
import { computed, ref, watch } from 'vue'
import TemplateForm from '../characters/TemplateForm.vue'

type Templates = NonNullable<ListTemplatesForUserData['character_templates']>

const props = defineProps<{
    clonedCharacter: Templates[number]
}>()

const loading = ref(false)
const valid = ref(false)

const template = ref<UpdateTemplateFormType>({
    id: props.clonedCharacter.id,
    name: props.clonedCharacter.name,
    description: props.clonedCharacter.description,
    illustration: undefined,
})

const preview = computed(() => props.clonedCharacter.illustration ?? undefined)

watch(() => props.clonedCharacter, (c) => {
    if (c) {
        template.value = {
            id: c.id,
            name: c.name,
            description: c.description,
            illustration: undefined,
        }
    }
})

defineExpose({
    formValid: valid,
    template,
})
</script>

<template>
    <TemplateForm
        v-model:template="template"
        v-model:valid="valid"
        :edit="!!preview"
        :loading="loading"
        :current-preview="preview"
    />
</template>
