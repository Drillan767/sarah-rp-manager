<script setup lang="ts">
import type {
    CreateTemplateFormType,
    UpdateTemplateFormType,
} from '@/types/forms'

import { useForm, useIsFormValid } from 'vee-validate'
import { computed, onMounted, ref, watch } from 'vue'
import vuetifyConfig from '@/composables/vuetifyConfig'

type Template = CreateTemplateFormType | UpdateTemplateFormType

const {
    edit = false,
    loading = false,
    currentPreview,
} = defineProps<{
    edit?: boolean
    loading?: boolean
    currentPreview?: string
}>()

const template = defineModel<Template>('template', { required: true })
const valid = defineModel<boolean>('valid', { required: true })

const preview = ref('')
const showImage = ref(false)

const { defineField, setValues, controlledValues } = useForm<Template>({
    validationSchema: computed(() => ({
        name: 'required',
        description: 'required',
        illustration: edit ? '' : 'required',
    })),
    initialValues: {
        ...template.value,
        illustration: undefined,
    },
})

defineField('id')
const [name, nameProps] = defineField('name', vuetifyConfig)
const [description, descriptionProps] = defineField('description', vuetifyConfig)
const [illustration, illustrationProps] = defineField('illustration', vuetifyConfig)
const [isPublic, isPublicProps] = defineField('isPublic', vuetifyConfig)
defineField('user')

const formValid = useIsFormValid()

onMounted(() => {
    if (edit && currentPreview) {
        preview.value = currentPreview
    }
})

function handleImage(e: Event) {
    const files = (e.target as HTMLInputElement).files

    if (files) {
        preview.value = URL.createObjectURL(files[0])
        setValues({
            illustration: files[0] as File,
        })
    }
}

watch(formValid, (newVal) => {
    valid.value = newVal
}, { immediate: true })

watch(template, newVal => setValues(newVal))
watch(controlledValues, (newVal) => {
    template.value = newVal
})
</script>

<template>
    <VContainer>
        <VForm>
            <VRow>
                <VCol cols="12" md="8">
                    <VTextField
                        v-model="name"
                        v-bind="nameProps"
                        :loading="loading"
                        label="Nom"
                    />
                </VCol>
                <VCol cols="12" md="4">
                    <VSwitch
                        v-model="isPublic"
                        v-bind="isPublicProps"
                        hint="Le modèle sera visible pour les utilisateurs visitant votre profil"
                        label="Public"
                        color="primary"
                        persistent-hint
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <VFileInput
                        v-model="illustration"
                        v-bind="illustrationProps"
                        :loading="loading"
                        label="Illustration"
                        @change="handleImage"
                    >
                        <template
                            v-if="preview !== ''"
                            #append
                        >
                            <VAvatar
                                :image="preview"
                                class="cursor-pointer"
                                @click.prevent="showImage = true"
                            />
                        </template>
                    </VFileInput>
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <VTextarea
                        v-model="description"
                        v-bind="descriptionProps"
                        :loading="loading"
                        label="Description"
                    />
                </VCol>
            </VRow>
        </VForm>
        <VDialog
            v-model="showImage"
            max-width="600"
        >
            <VImg
                :src="preview"
                :width="600"
                aspect-ratio="16/9"
                :cover="true"
            />
        </VDialog>
    </VContainer>
</template>
