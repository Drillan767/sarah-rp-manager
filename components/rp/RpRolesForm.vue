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

const freeRoleUsed = computed(() => rolesProxy.value.filter(r => r.free).length > 0)

function addRole(free: boolean = false) {
    rolesProxy.value.push({
        name: free ? t('pages.roleplays.form.free_role_name') : '',
        max_users: 1,
        description: free ? t('pages.roleplays.form.free_role_description') : '',
        roleplay_id: '',
        free,
    })
}

function removeRole(i: number) {
    if ('id' in rolesProxy.value[i]) {
        const payload = rolesProxy.value[i] as Role
        emit('delete', payload)
    }
    else {
        rolesProxy.value = rolesProxy.value.filter((_role, index) => index !== i)
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
                        <VCard
                            :color="rolesProxy[i].free ? 'primary' : undefined"
                            variant="outlined"
                        >
                            <RpRole
                                v-model="rolesProxy[i]"
                                @remove="removeRole(i)"
                            />
                        </VCard>
                    </VCol>
                </VRow>
            </VContainer>
            <div class="d-flex justify-center">
                <VBtn
                    variant="outlined"
                    rounded="xl"
                    prepend-icon="mdi-plus-circle-outline"
                    class="mt-4"
                    @click="addRole(false)"
                >
                    {{ t('pages.roleplays.form.roles_add') }}
                </VBtn>

                <VBtn
                    :disabled="freeRoleUsed"
                    color="blue"
                    variant="outlined"
                    rounded="xl"
                    prepend-icon="mdi-account-question-outline"
                    class="mt-4 ml-2"
                    @click="addRole(true)"
                >
                    {{ t('pages.roleplays.form.free_roles_add') }}
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
