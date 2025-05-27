<script setup lang="ts">
import type { CreateRoleVariables } from '@sarah-rp-manager/default-connector'
import { useForm, useIsFormValid } from 'vee-validate'
import { ref, watch } from 'vue'

const emit = defineEmits<{
    (e: 'update:valid', valid: boolean): void
    (e: 'delete'): void
}>()

const form = defineModel<CreateRoleVariables>('form', { required: true })

const { handleSubmit, defineField, controlledValues } = useForm<CreateRoleVariables>({
    validationSchema: {
        name: 'required',
        maxUsers: 'required',
        description: 'required',
    },
    initialValues: form.value,
})

const formValid = useIsFormValid()

watch(formValid, value => emit('update:valid', value), { immediate: true })
watch(controlledValues, value => form.value = value)
</script>

<template>
    <p>Basically je etre un poti role</p>
</template>
