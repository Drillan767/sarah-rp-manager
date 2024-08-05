<script setup lang="ts">
import type { CreatedRole, Role } from '~/types/models'

const props = defineProps<{ modelValue: CreatedRole | Role }>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: CreatedRole | Role): void
    (e: 'remove'): void
}>()

const { t } = useI18n()
const { defineField, controlledValues, setValues } = useForm<Role | CreatedRole>({
    validationSchema: {
        name: 'required',
        max_users: 'min_value:1|required',
        description: 'required',
    },
    initialValues: props.modelValue,
})

defineField('id')
const [name, nameProps] = defineField('name', vuetifyConfig)
const [maxUsers, maxUsersProps] = defineField('max_users', vuetifyConfig)
const [description, descriptionProps] = defineField('description', vuetifyConfig)
defineField('free')

watch(controlledValues, value => emit('update:modelValue', value))
watch(() => props.modelValue, value => setValues(value))
</script>

<template>
    <VContainer>
        <VRow :dense="true">
            <VCol cols="12" md="6">
                <VTextField
                    v-bind="nameProps"
                    v-model="name"
                    :disabled="modelValue.free"
                    :label="t('pages.roleplays.form.roles_name')"
                />
            </VCol>
            <VCol cols="6" md="3">
                <VNumberInput
                    v-bind="maxUsersProps"
                    v-model="maxUsers"
                    :label="t('pages.roleplays.form.roles_max_nb')"
                    control-variant="split"
                />
            </VCol>
            <VCol
                cols="6"
                md="3"
                class="d-flex justify-end"
            >
                <VBtn
                    icon="mdi-trash-can-outline"
                    color="error"
                    variant="flat"
                    @click="emit('remove')"
                />
            </VCol>
            <VCol cols="12">
                <VTextarea
                    v-bind="descriptionProps"
                    v-model="description"
                    :disabled="modelValue.free"
                    label="Description"
                    rows="2"
                    :auto-grow="true"
                />
            </VCol>
        </VRow>
    </VContainer>
</template>
