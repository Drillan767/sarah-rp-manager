<script setup lang="ts">
import type { CreateRoleVariables } from '@sarah-rp-manager/default-connector'
import { useForm, useIsFormValid } from 'vee-validate'
import { watch } from 'vue'
import vuetifyConfig from '@/composables/vuetifyConfig'

const emit = defineEmits<{
    (e: 'update:valid', valid: boolean): void
    (e: 'delete'): void
}>()

const form = defineModel<CreateRoleVariables>('form', { required: true })

const { defineField, controlledValues, setValues } = useForm<CreateRoleVariables>({
    validationSchema: {
        name: 'required',
        maxUsers: 'required|min_value:1',
        description: 'required',
    },
    initialValues: form.value,
})

const [name, nameProps] = defineField('name', vuetifyConfig)
const [maxUsers, maxUsersProps] = defineField('maxUsers', vuetifyConfig)
const [description, descriptionProps] = defineField('description', vuetifyConfig)
defineField('isFree')

const formValid = useIsFormValid()

watch(formValid, value => emit('update:valid', value), { immediate: true })
watch(controlledValues, value => form.value = value)
watch(form, value => setValues(value))
</script>

<template>
    <VCard
        prepend-icon="mdi-badge-account"
    >
        <template #append>
            <VBtn
                icon="mdi-trash-can-outline"
                color="error"
                variant="text"
                @click="emit('delete')"
            />
        </template>
        <template #text>
            <VRow>
                <VCol cols="12" md="6">
                    <VTextField
                        v-bind="nameProps"
                        v-model="name"
                        :disabled="form.isFree"
                        label="Nom"
                    />
                </VCol>
                <VCol cols="12" md="6">
                    <VNumberInput
                        v-bind="maxUsersProps"
                        v-model="maxUsers"
                        label="Nombre maximum d'utilisateurs"
                        control-variant="split"
                    />
                </VCol>
                <VCol cols="12">
                <VTextarea
                    v-bind="descriptionProps"
                    v-model="description"
                    :disabled="form.isFree"
                    label="Description"
                    rows="2"
                    :auto-grow="true"
                />
            </VCol>
            </VRow>
        </template>
    </VCard>
</template>
