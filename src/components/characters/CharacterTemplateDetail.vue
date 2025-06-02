<script setup lang="ts">
import type { GetTemplateData } from '@sarah-rp-manager/default-connector'
import type { UpdateTemplateFormType } from '@/types/forms'
import useCharacter from '@/composables/character'
import { ref } from 'vue'
import EditTemplateDialog from './EditTemplateDialog.vue'
import { VDialog } from 'vuetify/components'

type Template = NonNullable<GetTemplateData['character_template']>

interface Props {
    template: Template
}

const emit = defineEmits<{
    (e: 'saved'): void
}>()

const { deleteTemplate } = useCharacter()

const props = defineProps<Props>()

const reveal = ref(false)
const editTemplateDialog = ref(false)
const deleteTemplateDialog = ref(false)
const localTemplate = ref<UpdateTemplateFormType>({
    id: props.template.id,
    name: props.template.name,
    description: props.template.description,
    illustration: undefined,
})

async function removeTemplate() {
    await deleteTemplate(props.template.id)
    deleteTemplateDialog.value = false
    emit('saved')
}
</script>

<template>
    <VCard>
        <VImg
            :src="template.illustration"
            height="300"
            cover
        />
        <VCardTitle>
            {{ template.name }}
        </VCardTitle>
        <VCardText>
            {{ template.description }}
        </VCardText>
        <VCardActions>
            <VBtn
                v-if="template.participations.length > 0"
                append-icon="mdi-chevron-up"
                @click="reveal = true"
            >
                Utilisé {{ template.participations.length }} fois
            </VBtn>
            <VSpacer />
            <VBtn
                :disabled="template.participations.length > 0"
                icon="mdi-delete"
                variant="text"
                size="small"
                color="error"
                @click="deleteTemplateDialog = true"
            />
            <VBtn
                icon="mdi-pencil"
                variant="text"
                size="small"
                @click="editTemplateDialog = true"
            />
        </VCardActions>
        <VExpandTransition>
            <VCard
                v-if="reveal"
                class="position-absolute w-100"
                height="100%"
                style="bottom: 0;"
                title="Utilisations"
            >
                <template #text>

                </template>
                <template #actions>
                    <VBtn
                        icon="mdi-close"
                        variant="text"
                        size="small"
                        append-icon="mdi-chevron-down"
                        @click="reveal = false"
                    >
                        Fermer
                    </VBtn>
                </template>
            </VCard>
        </VExpandTransition>
    </VCard>
    <EditTemplateDialog
        v-if="localTemplate"
        v-model="editTemplateDialog"
        :template="localTemplate"
        :preview="template.illustration"
        @saved="emit('saved')"
    />
    <VDialog
        v-model="deleteTemplateDialog"
        max-width="500"
    >
        <VCard
            prepend-icon="mdi-delete"
            title="Supprimer le modèle de personnage ?"
        >
            <template #text>
                <p>
                    Vous êtes sur le point de supprimer le modèle de personnage "{{ template.name }}".<br>
                    L'action est irréversible.
                </p>
            </template>
            <template #actions>
                <VBtn
                    color="error"
                    variant="flat"
                    @click="removeTemplate"
                >
                    Supprimer
                </VBtn>
            </template>
        </VCard>
    </VDialog>
</template>