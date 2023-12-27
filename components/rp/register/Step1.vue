<script setup lang="ts">
import { useForm, useIsFormValid } from 'vee-validate'
import { vuetifyConfig } from '~/composables/vuetifyConfig'

interface RoleDetail {
    id: number
    name: string
    description: string
    max_users: number
    characters: any[]
}

interface UserCharacter {
    id: number
    name: string
    description: string
    illustration: string
    role_id: number
    user_id: number
}

interface Props {
    modelValue: number
    roles: RoleDetail[]
    characters: UserCharacter[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: Props['modelValue']): void
    (e: 'update:formValid', value: boolean): void
}>()

function roleUnavailble(role: RoleDetail) {
    if (role.max_users - role.characters[0] === 0)
        return true

    const characterRolesId = props.characters.map(uc => uc.role_id)
    const rpRolesId = props.roles.map(r => r.id)
    const commonIds = characterRolesId.filter(x => rpRolesId.includes(x))

    return commonIds.includes(role.id)
}

const { defineField } = useForm<{ roleId: number }>({
    validationSchema: {
        roleId: 'required',
    },
})
const [roleId, roleProps] = defineField('roleId', vuetifyConfig)
const formValid = useIsFormValid()

watch(formValid, value => emit('update:formValid', value))
watch(roleId, value => emit('update:modelValue', value))
</script>

<template>
    <VItemGroup
        v-bind="roleProps"
        v-model="roleId"
        :mandatory="true"
    >
        <VItem
            v-for="(role, i) in roles"
            :key="i"
            v-slot="{ isSelected, toggle }"
            :disabled="roleUnavailble(role)"
            :value="role.id"
        >
            <VCard
                color="blue"
                :variant="isSelected ? 'flat' : 'outlined' "
                class="mb-2"
                @click="toggle"
            >
                <template #title>
                    {{ role.name }}
                </template>
                <template #text>
                    {{ role.description }}
                </template>
            </VCard>
        </VItem>
    </VItemGroup>
</template>
