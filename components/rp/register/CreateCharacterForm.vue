<script setup lang="ts">
interface CharacterForm {
    name: string
    illustration: File[] | undefined
    description: string
}

const emit = defineEmits<{
    (e: 'update:formValid', value: boolean): void
}>()

const { t } = useI18n()

const preview = ref('')
const showPreviewModal = ref(false)

const { defineField } = useForm<CharacterForm>({
    validationSchema: {
        name: 'required',
        illustration: 'image|max:2000|required',
        description: 'required',
    },
})

const [name, nameProps] = defineField('name', vuetifyConfig)
const [illustration, illustrationProps] = defineField('illustration', vuetifyConfig)
const [description, descriptionProps] = defineField('description', vuetifyConfig)

const formValid = useIsFormValid()

function handleImage(e: Event) {
    const files = (e.target as HTMLInputElement).files

    if (files)
        preview.value = URL.createObjectURL(files[0])
}

watch(illustration, (value) => {
    if (!value || value.length === 0)
        preview.value = ''
})

watch(formValid, value => emit('update:formValid', value))
</script>

<template>
    <VTextField
        v-bind="nameProps"
        v-model="name"
        class="my-4"
        :label="t('fields.name')"
    />

    <VFileInput
        v-bind="illustrationProps"
        v-model="illustration"
        label="Illustration"
        class="mb-4"
        accept="image/*"
        :clearable="true"
        prepend-icon="mdi-image-album"
        @change="handleImage"
    >
        <template
            v-if="preview !== ''"
            #append
        >
            <VBtn
                icon
                variant="text"
                @click.prevent="showPreviewModal = true"
            >
                <VAvatar :image="preview" />
            </VBtn>
        </template>
    </VFileInput>

    <VTextarea
        v-bind="descriptionProps"
        v-model="description"
        label="Description"
        class="mb-4"
        :auto-grow="true"
        rows="2"
    />

    <VDialog
        v-model="showPreviewModal"
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
