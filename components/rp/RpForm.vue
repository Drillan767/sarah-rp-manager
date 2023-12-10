<script setup lang="ts">
import Wysiwyg from '~/components/rp/Wysiwyg.vue'
import useValidation from '~/composables/useValidation'

interface Props {
    loading: boolean
    form: {
        title: string
        start_date: string | null
        description: string
        illustration: File | null
        public: boolean
    }
    currentPreview?: string
    edit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    edit: false,
})
const emit = defineEmits<{
    (e: 'input', value: Props['form']): void
    (e: 'save'): void
}>()
const { t } = useI18n()
const dayjs = useDayjs()
const { requiredRule, imageRule, notBeforeRule } = useValidation()

const minDate = dayjs().format('YYYY-MM-DDT00:00')

/* const emit = defineEmits<{
    input: [value: Props['form']],

}>() */

const preview = ref('')
const showImage = ref(false)

const formProxy = computed({
    get: () => props.form,
    set: value => emit('input', value),
})

onMounted(() => {
    if (props.edit) {
        if (props.currentPreview)
            preview.value = props.currentPreview
        formProxy.value.start_date = dayjs(formProxy.value.start_date).format('YYYY-MM-DD')
    }
})

function handleImage(e: Event) {
    const files = (e.target as HTMLInputElement).files

    if (files) {
        preview.value = URL.createObjectURL(files[0])
        formProxy.value.illustration = files[0]
    }
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
                    <VCol cols="12" md="6">
                        <VTextField
                            v-model="formProxy.title"
                            color="primary"
                            variant="outlined"
                            :label="t('pages.roleplays.form.title')"
                            :rules="[requiredRule]"
                        />
                    </VCol>
                    <VCol cols="12" md="6">
                        <VTextField
                            v-model="formProxy.start_date"
                            color="primary"
                            variant="outlined"
                            type="date"
                            :min="minDate"
                            :label="t('pages.roleplays.form.begin')"
                            :rules="[notBeforeRule(minDate, formProxy.start_date ?? ''), requiredRule]"
                        />
                    </VCol>
                </VRow>
                <VRow>
                    <VCol cols="12" md="6" class="d-flex">
                        <VFileInput
                            :class="{ 'mr-5': preview !== '' }"
                            label="Illustration"
                            color="primary"
                            variant="outlined"
                            accept="image/*"
                            :clearable="true"
                            prepend-icon="mdi-image-album"
                            :rules="[imageRule(edit, formProxy.illustration)]"
                            hint="max: 2 mb"
                            @change="handleImage"
                        />
                        <VBtn
                            v-if="preview !== ''"
                            color="primary"
                            variant="outlined"
                            icon="mdi-image-area"
                            @click.prevent="showImage = true"
                        />
                    </VCol>
                    <VCol cols="12" md="6">
                        <VSwitch
                            v-model="formProxy.public"
                            color="primary"
                            :label="t('pages.roleplays.form.public')"
                            :hide-details="true"
                        />
                    </VCol>
                </VRow>
                <VRow>
                    <VCol>
                        <Wysiwyg v-model="formProxy.description" />
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
                @click.prevent="emit('save')"
            >
                {{ t('form.save') }}
            </VBtn>
        </template>
    </VCard>
</template>
