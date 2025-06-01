<script setup lang="ts">
import type {
    CreateTemplateFormType,
    UpdateTemplateFormType,
} from '@/types/forms'

import { useForm, useIsFormValid } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import vuetifyConfig from '@/composables/vuetifyConfig'

type Template = CreateTemplateFormType | UpdateTemplateFormType

const {
    edit = false,
    loading = false,
} = defineProps<{
    edit?: boolean
    loading?: boolean
}>()

const template = defineModel<Template>('template', { required: true })
const valid = defineModel<boolean>('valid', { required: true })

const { defineField, setValues } = useForm<Template>({
    validationSchema: computed(() => ({
        name: 'required',
        description: 'required',
        illustration: edit ? '' : 'required',
    })),
})

defineField('id')
const [name, nameProps] = defineField('name', vuetifyConfig)
const [description, descriptionProps] = defineField('description', vuetifyConfig)
const [illustration, illustrationProps] = defineField('illustration', vuetifyConfig)
const [isPublic, isPublicProps] = defineField('isPublic', vuetifyConfig)

const formValid = useIsFormValid()

watch(formValid, (newVal) => {
    valid.value = newVal
})

watch(template, newVal => setValues(newVal))
</script>

<template>
    <VContainer>
        <VForm>
            <VRow>
                <VCol cols="12" md="8">
                    <VTextField
                        v-model="name"
                        v-bind="nameProps"
                        label="Nom"
                    />
                </VCol>
                <VCol cols="12" md="4">
                    <VSwitch
                        v-model="isPublic"
                        v-bind="isPublicProps"
                        hint="Le modèle sera visible pour les utilisateurs visitant votre profil"
                        label="Public"
                        persistent-hint
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <VFileInput
                        v-model="illustration"
                        v-bind="illustrationProps"
                        label="Illustration"
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <VTextarea
                        v-model="description"
                        v-bind="descriptionProps"
                        label="Description"
                    />
                </VCol>
            </VRow>
        </VForm>
    </VContainer>
</template>
