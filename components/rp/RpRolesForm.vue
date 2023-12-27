<script setup lang="ts">
import RpRole from './RpRole.vue'
import type { CreatedRole, Role } from '~/types/models'

interface Props {
    edit: boolean
    loading: boolean
    roles: (CreatedRole | Role)[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'delete', value: Role): void
    (e: 'update'): void
    (e: 'update:roles', value: (CreatedRole | Role)[]): void
}>()
const { t } = useI18n()

const rolesProxy = computed({
    get: () => props.roles,
    set: value => emit('update:roles', value),
})

function addRole() {
    rolesProxy.value.push({
        name: '',
        max_users: 1,
        description: '',
        roleplay_id: '',
    })
}

function removeRole(i: number) {
    if ('id' in rolesProxy.value[i]) {
        const payload = rolesProxy.value[i] as Role
        emit('delete', payload)
    }
    else {
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
                        v-for="(_, i) in rolesProxy"
                        :key="i"
                        cols="12"
                        md="6"
                    >
                        <RpRole
                            v-model="rolesProxy[i]"
                            @remove="removeRole(i)"
                        />
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
        <template v-if="edit" #actions>
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
