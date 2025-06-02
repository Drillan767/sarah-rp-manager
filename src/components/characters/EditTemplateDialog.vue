<script setup lang="ts">
import type { UpdateTemplateFormType } from '@/types/forms'
import useCharacter from '@/composables/character'
import { ref, watch } from 'vue'
import TemplateForm from './TemplateForm.vue'

const props = defineProps<{
    template: UpdateTemplateFormType
    preview: string
}>()

const emit = defineEmits<{
    (e: 'saved'): void
}>()

const { updateTemplate } = useCharacter()

const open = defineModel<boolean>({ required: true })

const loading = ref(false)
const valid = ref(false)
const localTemplate = ref<UpdateTemplateFormType>({ ...props.template })

// Update local template when prop changes
watch(() => props.template, (newTemplate) => {
    localTemplate.value = { ...newTemplate }
}, { deep: true })

async function storeTemplate() {
    loading.value = true
    await updateTemplate(localTemplate.value)
    loading.value = false
    emit('saved')
    open.value = false
}
</script>

<template>
<VDialog
        v-model="open"
        max-width="800"
    >
        <VCard
            prepend-icon="mdi-account-box-edit-outline"
            title="Créer un modèle depersonnage"
            :loading="loading"
        >
            <template #text>
                <TemplateForm
                    v-model:template="localTemplate"
                    v-model:valid="valid"
                    :edit="true"
                    :current-preview="preview"
                    :loading="loading"
                />
            </template>
            <template #actions>
                <VSpacer />
                <VBtn
                    @click="open = false"
                >
                    Annuler
                </VBtn>
                <VBtn
                    color="primary"
                    :loading="loading"
                    :disabled="!valid || loading"
                    variant="flat"
                    @click="storeTemplate"
                >
                    Créer
                </VBtn>
            </template>
        </VCard>
    </VDialog>
</template>