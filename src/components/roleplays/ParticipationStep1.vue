<script setup lang="ts">
import type { ParticipationRole } from '@/types/forms'
import { storeToRefs } from 'pinia'
import useUsersStore from '@/stores/users'
import { useForm, useIsFormValid } from 'vee-validate'
import vuetifyConfig from '@/composables/vuetifyConfig'
import { computed, watch } from 'vue'

interface Form {
    role: ParticipationRole
}

const props = defineProps<{
    roles: ParticipationRole[]
}>()

const pickedRole = defineModel<ParticipationRole>()

const { user } = storeToRefs(useUsersStore())

const { defineField } = useForm<Form>({
    validationSchema: {
        role: 'required',
    },
})

// Disable the role if the user has already picked it or if full
const rolesWithDisabled = computed(() => props.roles.map(role => ({
    ...role,
    disabled: user.value?.id === pickedRole.value?.id,
})))

const [selection, selectionProps] = defineField('role', vuetifyConfig)
const isFormValid = useIsFormValid()

watch(selection, (value) => {
    pickedRole.value = value
})

defineExpose({
    valid: isFormValid,
})

</script>

<template>
    <VItemGroup
        v-bind="selectionProps"
        v-model="selection"
    >
        <VRow
            v-for="role in roles"
            :key="role.id"
        >
            <VItem
                v-slot="{ isSelected, toggle }"
                :value="role.id"
            >
                <VCol>
                    <VCard
                        :title="role.name"
                        :text="role.description"
                        :append-icon="isSelected ? 'mdi-check-circle' : undefined"
                        :variant="isSelected ? 'tonal' : 'outlined'"
                        @click="toggle"
                    />
                </VCol>
            </VItem>
        </VRow>
    </VItemGroup>
</template>
