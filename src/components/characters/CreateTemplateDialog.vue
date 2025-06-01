<script setup lang="ts">
import type { CreateTemplateFormType } from '@/types/forms'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import useCharacter from '@/composables/character'
import useUsersStore from '@/stores/users'
import TemplateForm from './TemplateForm.vue'

const emit = defineEmits<{
    (e: 'saved'): void
}>()

const { user } = storeToRefs(useUsersStore())
const { createTemplate } = useCharacter()

const open = defineModel<boolean>({ required: true })

const template = ref<CreateTemplateFormType>({
    name: '',
    description: '',
    illustration: new File([], ''),
    user: user.value?.id ?? '',
    isPublic: false,
})

const loading = ref(false)
const valid = ref(false)

async function storeTemplate() {
    loading.value = true
    await createTemplate(template.value)
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
                    v-model:template="template"
                    v-model:valid="valid"
                    :edit="false"
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
