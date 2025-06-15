<script setup lang="ts">
import type { CreateRoleVariables, EditRoleVariables } from '@sarah-rp-manager/default-connector'
import { useForm, useIsFormValid } from 'vee-validate'
import { watch } from 'vue'
import vuetifyConfig from '@/composables/vuetifyConfig'

interface Props {
    roleUsed?: boolean
    mode: 'create' | 'update'
}

defineProps<Props>()

const emit = defineEmits<{
    (e: 'update:valid', valid: boolean): void
    (e: 'delete'): void
}>()

const role = defineModel<CreateRoleVariables | EditRoleVariables>('role', { required: true })

const { defineField, controlledValues, setValues } = useForm<CreateRoleVariables | EditRoleVariables>({
    validationSchema: {
        name: 'required',
        maxUsers: 'required|min_value:1',
        description: 'required',
    },
    initialValues: role.value,
})

defineField('id')
const [name, nameProps] = defineField('name', vuetifyConfig)
const [maxUsers, maxUsersProps] = defineField('maxUsers', vuetifyConfig)
const [description, descriptionProps] = defineField('description', vuetifyConfig)
defineField('isFree')

const formValid = useIsFormValid()

watch(formValid, value => emit('update:valid', value), { immediate: true })
watch(controlledValues, value => role.value = value)
watch(role, value => setValues(value))
</script>

<template>
    <VCard
        prepend-icon="mdi-badge-account"
        :title="mode === 'create' ? 'Nouveau rôle' : 'Modifier le rôle'"
    >
        <template #append>
            <VTooltip
                :disabled="!roleUsed"
                location="top"
            >
                <template #activator="{ props: tooltip }">
                    <VBtn
                        v-bind="tooltip"
                        icon="mdi-trash-can-outline"
                        color="error"
                        variant="text"
                        :disabled="roleUsed"
                        @click="emit('delete')"
                    />
                </template>
            </VTooltip>
        </template>
        <template #text>
            <VRow>
                <VCol cols="12" md="6">
                    <VTextField
                        v-bind="nameProps"
                        v-model="name"
                        :disabled="role.isFree"
                        label="Nom"
                    >
                        <template #append-inner>
                            <VTooltip
                                v-if="roleUsed"
                                text="Ce rôle est utilisé par un au moins un personnage"
                            >
                                <template #activator="{ props: tooltip }">
                                    <VIcon
                                        v-bind="tooltip"
                                        icon="mdi-alert-circle-outline"
                                        color="warning"
                                    />
                                </template>
                            </VTooltip>
                        </template>
                    </VTextField>
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
                        :disabled="role.isFree"
                        label="Description"
                        rows="2"
                        :auto-grow="true"
                    >
                        <template #append-inner>
                            <VTooltip
                                v-if="roleUsed"
                                text="Ce rôle est utilisé par un au moins un personnage"
                            >
                                <template #activator="{ props: tooltip }">
                                    <VIcon
                                        v-bind="tooltip"
                                        icon="mdi-alert-circle-outline"
                                        color="warning"
                                    />
                                </template>
                            </VTooltip>
                        </template>
                    </VTextarea>
                </VCol>
            </VRow>
        </template>
    </VCard>
</template>
