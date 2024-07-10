<script setup lang="ts">
import { useForm, useIsFormValid } from 'vee-validate'
import Wysiwyg from '~/components/rp/Wysiwyg.vue'
import { vuetifyConfig } from '@/composables/vuetifyConfig'

interface Props {
    loading: boolean
    valid: boolean
    form: {
        id: number
        title: string
        start_date: string | null
        description: string
        illustration: File | undefined
    }
    currentPreview?: string
    edit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    edit: false,
})

const emit = defineEmits<{
    (e: 'update:form', value: Props['form']): void
    (e: 'update:valid', value: boolean): void
    (e: 'save'): void
}>()

const { t } = useI18n()
const dayjs = useDayjs()

const { defineField, setValues, controlledValues } = useForm<Props['form']>({
    validationSchema: {
        title: 'required',
        illustration: props.edit ? 'image|max:2000' : 'required|image|max:2000',
        description: 'required',
    },
    initialValues: props.form,
})

defineField('id')
const [title, titleProps] = defineField('title', vuetifyConfig)
const [illustration, illustrationProps] = defineField('illustration', vuetifyConfig)
const [startDate, startDateProps] = defineField('start_date', vuetifyConfig)
const [description] = defineField('description', vuetifyConfig)
const formValid = useIsFormValid()

const minDate = dayjs().format('YYYY-MM-DDT00:00')

const preview = ref('')
const showImage = ref(false)

onMounted(() => {
    if (props.edit) {
        if (props.currentPreview)
            preview.value = props.currentPreview
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

watch(illustration, (value) => {
    if (!value)
        preview.value = ''
})

watch(() => props.form, (newVal, oldVal) => {
    if (oldVal.title === '' && newVal.title.length > 0) {
        const { start_date, ...fields } = newVal
        setValues({
            ...fields,
            start_date: dayjs(start_date).format('YYYY-MM-DD'),
        })
        if (props.currentPreview)
            preview.value = props.currentPreview
    }
})

watch(controlledValues, value => emit('update:form', value))
watch(formValid, value => emit('update:valid', value), { immediate: true })

function submit() {
    emit('save')
}
</script>

<template>
    <VCard
        prepend-icon="mdi-receipt-text-edit-outline"
        :loading="loading"
    >
        <template #title>
            {{ t('pages.roleplays.form.infos') }}
        </template>
        <template #text>
            <VContainer>
                <VRow>
                    <VCol cols="12" md="5">
                        <VTextField
                            v-bind="titleProps"
                            v-model="title"
                            :label="t('pages.roleplays.form.title')"
                        />
                    </VCol>
                    <VCol cols="12" md="5" class="d-flex">
                        <VFileInput
                            v-bind="illustrationProps"
                            v-model="illustration"
                            accept="image/*"
                            :clearable="true"
                            label="Illustration"
                            hint="max: 2 mb"

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
                            :label="t('pages.roleplays.form.begin')"
                            :clearable="true"
                        />
                    </VCol>
                </VRow>
                <VRow>
                    <VCol>
                        <Wysiwyg
                            v-model="description"
                        />
                    </VCol>
                </VRow>
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
        <template v-if="edit" #actions>
            <VSpacer />
            <VBtn
                color="primary"
                :disabled="!formValid"
                @click.prevent="submit"
            >
                {{ t('form.save') }}
            </VBtn>
        </template>
    </VCard>
</template>
