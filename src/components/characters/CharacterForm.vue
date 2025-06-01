<script setup lang="ts">
import type { CreateCharacterVariables, EditCharacterVariables } from '@sarah-rp-manager/default-connector'
import { useForm, useIsFormValid } from 'vee-validate'
import { computed, ref } from 'vue'

type Character = CreateCharacterVariables | EditCharacterVariables

const {
    edit = false,
} = defineProps<{
    edit?: boolean
}>()

const character = defineModel<Character>({
    required: true,
})

const loading = ref(false)

const { defineField, setValues, handleSubmit } = useForm<Character>({
    validationSchema: computed(() => ({
        name: 'required',
        description: 'required',
        illustration: edit ? '' : 'required',
    })),
})
</script>

<template>
    <VContainer>
        <VForm />
    </VContainer>
</template>
