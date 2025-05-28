<script setup lang="ts">
import type { CreateRoleplayVariables } from '@sarah-rp-manager/default-connector'
import { useForm, useIsFormValid } from 'vee-validate'
import { ref, watch } from 'vue'
import Wysiwyg from '@/components/Wysiwyg.vue'
import useDayjs from '@/composables/dayjs'
import vuetifyConfig from '@/composables/vuetifyConfig'

type RoleplayFormType = Omit<CreateRoleplayVariables, 'illustration'> & {
    illustration: File
}

const {
    edit = false,
} = defineProps<{ edit?: boolean }>()

const emit = defineEmits<{
    (e: 'submit'): void
}>()

const dayjs = useDayjs()

const minDate = dayjs().format('YYYY-MM-DDT00:00')

const form = defineModel<RoleplayFormType>('form', { required: true })
const valid = defineModel<boolean>('valid', { required: true })

const { defineField, controlledValues, setValues } = useForm<RoleplayFormType>({
    validationSchema: {
        title: 'required',
        description: 'required',
    },
    initialValues: form.value,
})

const formValid = useIsFormValid()

const preview = ref('')
const showImage = ref(false)

const [title, titleProps] = defineField('title', vuetifyConfig)
const [description] = defineField('description', vuetifyConfig)
const [startDate, startDateProps] = defineField('startDate', vuetifyConfig)

const illustrationFile = ref<File>()

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
    (value: File) => {
        if (!edit && !value) {
            return 'Champ requis'
        }

        if (value.size > 4 * 1024 * 1024) {
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
            <VContainer>
                <VRow>
                    <VCol cols="12" md="5">
                        <VTextField
                            v-bind="titleProps"
                            v-model="title"
                            label="Titre"
                        />
                    </VCol>
                    <VCol cols="12" md="5">
                        <VFileInput
                            v-model="illustrationFile"
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
                            label="Date de début"
                            :clearable="true"
                        />
                    </VCol>
                </VRow>
                <Wysiwyg
                    v-model:content="description"
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
            </VContainer>
        </template>
        <template
            v-if="edit"
            #actions
        >
            <VBtn
                color="primary"
                :disabled="!formValid"
                @click="emit('submit')"
            >
                Enregistrer
            </VBtn>
        </template>
    </VCard>
</template>
