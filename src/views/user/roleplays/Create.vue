<script setup lang="ts">
import type { CreateRoleplayVariables, CreateRoleVariables } from '@sarah-rp-manager/default-connector'
import type { Toast } from '@/types'
import { computed, inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import RoleForm from '@/components/roleplays/RoleForm.vue'
import RoleplayForm from '@/components/roleplays/RoleplayForm.vue'
import useRoleplays from '@/composables/roleplays'

type RoleplayFormType = Omit<CreateRoleplayVariables, 'illustration'> & {
    illustration: File
}

const { createRP } = useRoleplays()
const router = useRouter()
const toast = inject<Toast>('toast')

const roleplay = ref<RoleplayFormType>({
    title: '',
    description: '',
    illustration: new File([], ''),
    user: '',
})

const roles = ref<CreateRoleVariables[]>([{
    name: '',
    maxUsers: 0,
    description: '',
    isFree: false,
    roleplay: '',
}])

const roleplayValid = ref(false)
const loading = ref(false)

const rolesForms = ref<InstanceType<typeof RoleForm>[]>([])
const rolesValid = ref<boolean[]>([])

const freeRoleUsed = computed(() => roles.value.some(role => role.isFree))
const canSubmit = computed(() => roleplayValid.value && rolesValid.value.every(valid => valid))

function assignRoleRef(el: InstanceType<typeof RoleForm>, index: number) {
    rolesForms.value[index] = el
}

async function handleSubmit() {
    loading.value = true
    try {
        const id = await createRP(roleplay.value, roles.value)
        toast?.showSuccess('Roleplay créé avec succès')
        router.push({ name: 'user-roleplays-edit', params: { rpId: id } })
    }
    catch (error) {
        console.error(error)
        toast?.showError('Une erreur est survenue lors de la création du roleplay')
    }
    finally {
        loading.value = false
    }
}

function addRole(free: boolean) {
    roles.value.push({
        name: free ? 'Rôle libre' : '',
        maxUsers: 0,
        description: free ? 'Les utilisateurs qui choisiront ce rôle utiliseront leur propre profil comme personnage' : '',
        isFree: free,
        roleplay: '',
    })
}

function removeRole(index: number) {
    roles.value.splice(index, 1)
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
                        :loading="loading"
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <VCard title="Rôles">
                        <template #append>
                            <VBtn
                                :disabled="freeRoleUsed"
                                prepend-icon="mdi-plus"
                                color="primary"
                                variant="outlined"
                                class="mr-2"
                                @click="addRole(true)"
                            >
                                Ajouter un rôle libre
                            </VBtn>
                            <VBtn
                                prepend-icon="mdi-plus"
                                color="primary"
                                variant="flat"
                                @click="addRole(false)"
                            >
                                Ajouter un rôle
                            </VBtn>
                        </template>
                        <template #text>
                            <VContainer>
                                <VRow>
                                    <VCol
                                        v-for="(_, i) in roles.length"
                                        :key="i"
                                        cols="12"
                                        md="4"
                                    >
                                        <RoleForm
                                            :ref="(el) => el && assignRoleRef(el as InstanceType<typeof RoleForm>, i)"
                                            v-model:role="roles[i]"
                                            mode="create"
                                            :role-used="false"
                                            @update:valid="(v) => rolesValid[i] = v"
                                            @delete="removeRole(i)"
                                        />
                                    </VCol>
                                </VRow>
                            </VContainer>
                        </template>
                    </VCard>
                </VCol>
            </VRow>
            <VRow>
                <VCol class="d-flex justify-end">
                    <VBtn
                        color="primary"
                        type="submit"
                        :disabled="loading || !canSubmit"
                        @click="handleSubmit"
                    >
                        Enregistrer
                    </VBtn>
                </VCol>
            </VRow>
        </VForm>
    </VContainer>
</template>
