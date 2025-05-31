<script setup lang="ts">
import type { CreateRoleplayFormType, UpdateRoleplayFormType } from '@/types/forms'
import { useForm, useIsFormValid } from 'vee-validate'
import { onMounted, ref, watch } from 'vue'
import Wysiwyg from '@/components/Wysiwyg.vue'
import useDayjs from '@/composables/dayjs'
import vuetifyConfig from '@/composables/vuetifyConfig'

interface Props {
    edit?: boolean
    loading?: boolean
    currentPreview?: string
}

const {
    edit = false,
    loading = false,
    currentPreview,
} = defineProps<Props>()

const emit = defineEmits<{
    (e: 'submit'): void
}>()

const dayjs = useDayjs()

const minDate = dayjs().format('YYYY-MM-DDT00:00')

const form = defineModel<CreateRoleplayFormType | UpdateRoleplayFormType>('form', { required: true })
const valid = defineModel<boolean>('valid', { required: true })

const { defineField, controlledValues, setValues } = useForm<CreateRoleplayFormType | UpdateRoleplayFormType>({
    validationSchema: {
        title: 'required',
        description: 'required',
        illustration: 'required',
    },
    initialValues: form.value,
})

const formValid = useIsFormValid()

const preview = ref('')
const showImage = ref(false)

onMounted(() => {
    if (edit && currentPreview) {
        preview.value = currentPreview
    }
})

defineField('id')
const [title, titleProps] = defineField('title', vuetifyConfig)
const [description] = defineField('description', vuetifyConfig)
const [startDate, startDateProps] = defineField('startDate', vuetifyConfig)
const [Illustration, illustrationProps] = defineField('illustration', vuetifyConfig)

function handleImage(e: Event) {
    const files = (e.target as HTMLInputElement).files

    if (files) {
        preview.value = URL.createObjectURL(files[0])
        setValues({
            illustration: files[0] as File,
        })
    }
}

const illustrationRules = [
    (value: File | string) => {
        if (!edit && !value) {
            return 'Champ requis'
        }

        if (value instanceof File && value.size > 4 * 1024 * 1024) {
            return 'Taille maximale de 4 mo'
        }

        return true
    },
]

watch(controlledValues, (newValues) => {
    form.value = newValues
})

watch(formValid, (newValues) => {
    valid.value = newValues
})
</script>

<template>
    <VCard>
        <template #text>
            <VContainer class="pb-0">
                <VRow>
                    <VCol cols="12" md="5">
                        <VTextField
                            v-bind="titleProps"
                            v-model="title"
                            :loading="loading"
                            label="Titre"
                        />
                    </VCol>
                    <VCol cols="12" md="5">
                        <VFileInput
                            v-bind="illustrationProps"
                            v-model="Illustration"
                            :loading="loading"
                            :clearable="true"
                            :rules="illustrationRules"
                            accept="image/*"
                            label="Illustration"
                            hint="max: 4 mo"
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
                    <VCol cols="12" md="2">
                        <VTextField
                            v-bind="startDateProps"
                            v-model="startDate"
                            type="date"
                            :min="minDate"
                            :loading="loading"
                            label="Date de début"
                            :clearable="true"
                        />
                    </VCol>
                </VRow>
            </VContainer>
            <Wysiwyg
                v-model:content="description"
                :loading="loading"
                title="Description"
            />
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
        </template>
        <template
            v-if="edit"
            #actions
        >
            <VSpacer />
            <VBtn
                color="primary"
                :disabled="!formValid"
                variant="flat"
                @click="emit('submit')"
            >
                Enregistrer
            </VBtn>
        </template>
    </VCard>
</template>
