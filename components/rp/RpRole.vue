<script setup lang="ts">
import type { CreatedRole, Role } from '~/types/models'

const props = defineProps<{ modelValue: CreatedRole | Role }>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: CreatedRole | Role): void
    (e: 'remove'): void
}>()

const { t } = useI18n()
const { defineField, controlledValues } = useForm<Role | CreatedRole>({
    validationSchema: {
        name: 'required',
        maxUsers: 'min:1|required',
        description: 'required',
    },
    initialValues: props.modelValue,
})

const [name, nameProps] = defineField('name', vuetifyConfig)
const [maxUsers, maxUsersProps] = defineField('max_users', vuetifyConfig)
const [description, descriptionProps] = defineField('description', vuetifyConfig)

watch(controlledValues, value => emit('update:modelValue', value))
</script>

<template>
    <VContainer>
        <VRow :dense="true">
            <VCol cols="6">
                <VTextField
                    v-bind="nameProps"
                    v-model="name"
                    :label="t('pages.roleplays.form.roles_name')"
                />
            </VCol>
            <VCol cols="3">
                <VTextField
                    v-bind="maxUsersProps"
                    v-model="maxUsers"
                    :label="t('pages.roleplays.form.roles_max_nb')"
                    type="number"
                />
            </VCol>
            <VCol
                cols="3"
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
                    label="Description"
                    rows="2"
                    :auto-grow="true"
                />
            </VCol>
        </VRow>
    </VContainer>
</template>
