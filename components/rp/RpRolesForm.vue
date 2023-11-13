<script setup lang="ts">
import type  { CreatedRole, Role } from '~/types/models'
import useValidation from '~/composables/useValidation'

interface Props {
    edit: boolean
    loading: boolean
    roles: (CreatedRole|Role)[]
}

const { t } = useI18n()
const { requiredRule, minValueRule } = useValidation()

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'delete', value: Role): void,
    (e: 'update'): void,
    (e: 'update:roles', value: (CreatedRole|Role)[]): void,
}>()

const rolesProxy = computed({
    get: () => props.roles,
    set: (value) => emit('update:roles', value)
})

const addRole = () => {
    rolesProxy.value.push({
        name: '',
        max_users: 1,
        description: '',
        roleplay_id: '',
    })
}

const removeRole = (i: number) => {
    if ('id' in rolesProxy.value[i]) {
        const payload = rolesProxy.value[i] as Role
        emit('delete', payload)
    } else {
        rolesProxy.value.splice(i, 1)
    }
}

</script>

<template>
    <VCard
        :loading="loading"
        prepend-icon="mdi-badge-account"
    >
        <template #title>
            {{ t('pages.roleplays.form.role', 2) }}
        </template>
        <template #text>
            <VContainer>
                <VRow>
                    <VCol
                        v-for="(role, i) in rolesProxy"
                        :key="i"
                        cols="12"
                        md="6"
                    >
                        <VContainer>
                            <VRow
                                :dense="true"
                            >
                                <VCol cols="6">
                                    <VTextField
                                        :label="t('pages.roleplays.form.roles_name')"
                                        variant="outlined"
                                        color="primary"
                                        :rules="[requiredRule]"
                                        v-model="role.name"
                                    />
                                </VCol>
                                <VCol cols="3">
                                    <VTextField
                                        :label="t('pages.roleplays.form.roles_max_nb')"
                                        variant="outlined"
                                        type="number"
                                        color="primary"
                                        :rules="[minValueRule(1, role.max_users)]"
                                        v-model="role.max_users"
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
                                        @click="removeRole(i)"
                                    />
                                </VCol>
                                <VCol cols="12">
                                    <VTextarea
                                        label="Description"
                                        variant="outlined"
                                        v-model="role.description"
                                        rows="2"
                                        :rules="[requiredRule]"
                                        :auto-grow="true"
                                        color="primary"
                                    />
                                </VCol>
                            </VRow>
                        </VContainer>
                    </VCol>
                </VRow>

            </VContainer>
            <div class="d-flex justify-center">
                <VBtn
                    color="blue"
                    variant="outlined"
                    rounded="xl"
                    prepend-icon="mdi-plus-circle-outline"
                    class="mt-4"
                    @click="addRole"
                >
                    {{ t('pages.roleplays.form.roles_add') }}
                </VBtn>
            </div>
        </template>
        <template #actions v-if="edit">
            <VSpacer />
            <VBtn
                color="primary"
                @click.prevent="emit('update')"
            >
                {{ t('form.save') }}
            </VBtn>
        </template>
    </VCard>
</template>