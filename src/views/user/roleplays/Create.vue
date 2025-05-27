<script setup lang="ts">
import type { CreateRoleplayVariables, CreateRoleVariables } from '@sarah-rp-manager/default-connector'
import { ref } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import RoleplayForm from '@/components/roleplays/RoleplayForm.vue'
import RolesForm from '@/components/roleplays/RolesForm.vue'
import useRoleplays from '@/composables/roleplays'

type RoleplayFormType = Omit<CreateRoleplayVariables, 'illustration'> & {
    illustration: File
}

const { createRoleplay } = useRoleplays()

const roleplay = ref<RoleplayFormType>({
    title: '',
    description: '',
    illustration: new File([], ''),
    user: '',
})

const roles = ref<CreateRoleVariables[]>([])

const roleplayValid = ref(false)

const rolesForms = ref<InstanceType<typeof RolesForm>[]>([])
const rolesValid = ref<boolean[]>([])

function assignRoleRef(el: InstanceType<typeof RolesForm>, index: number) {
    rolesForms.value[index] = el
}

const links = [
    {
        title: 'Accueil',
        to: '/',
    },
    {
        title: 'Mes roleplays',
        to: { name: 'user-roleplays' },
    },
    {
        title: 'Nouveau roleplay',
    },
]
</script>

<template>
    <VContainer>
        <VForm>
            <VRow>
                <VCol>
                    <Breadcrumb :links />
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <h1 class="text-h3 mb-4">
                        Nouveau roleplay
                    </h1>
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <RoleplayForm
                        v-model:form="roleplay"
                        v-model:valid="roleplayValid"
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <template v-for="i in roles.length" :key="i">
                        <RolesForm
                            :ref="(el) => el && assignRoleRef(el as InstanceType<typeof RolesForm>, i)"
                            v-model:form="roles[i]"
                            @update:valid="(v) => rolesValid[i] = v"
                        />
                    </template>
                </VCol>
            </VRow>
        </VForm>
    </VContainer>
</template>
