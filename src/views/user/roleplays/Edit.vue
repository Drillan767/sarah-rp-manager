<script setup lang="ts">
import type { CreateRoleVariables, EditRoleVariables, GetRoleplayData } from '@sarah-rp-manager/default-connector'
import type { Toast } from '@/types'
import type { UpdateRoleplayFormType } from '@/types/forms'
import {
    createRole as createRoleQuery,
    deleteRole as deleteRoleQuery,
    editRole as editRoleQuery,
} from '@sarah-rp-manager/default-connector'
import { useHead } from '@vueuse/head'
import { storeToRefs } from 'pinia'
import { computed, inject, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import RoleForm from '@/components/roleplays/RoleForm.vue'
import RoleplayForm from '@/components/roleplays/RoleplayForm.vue'
import useRoleplays from '@/composables/roleplays'
import useUsersStore from '@/stores/users'
import MessageBoard from './MessageBoard.vue'

const route = useRoute()
const router = useRouter()
const toast = inject<Toast>('toast')
const { user } = storeToRefs(useUsersStore())

const rpId = route.params.rpId.toString()

const { updateRP, getRP, deleteRP } = useRoleplays()

const roleplay = ref<GetRoleplayData['roleplay']>()
const loading = ref(false)
const valid = ref(false)
const showDeleteDialog = ref(false)
const preview = ref<string>()
const deleteRoleDialog = ref(false)
const deleteRoleId = ref<string>()
const newIllustration = ref<File>()
const form = ref<UpdateRoleplayFormType>()
const roles = ref<(CreateRoleVariables | EditRoleVariables)[]>([])
const rolesValid = ref<boolean[]>([])
const rolesForms = ref<InstanceType<typeof RoleForm>[]>([])

const freeRoleUsed = computed(() => roles.value.some(role => role.isFree))
const allRolesValid = computed(() => {
    if (roles.value.length === 0) {
        return false
    }

    return rolesValid.value.every(valid => valid)
})

async function getRoleplay() {
    if (!user.value) {
        return
    }

    loading.value = true
    roleplay.value = await getRP(rpId, user.value?.id)

    if (!roleplay.value) {
        router.push({ name: 'user-roleplays' })
        return
    }

    useHead({
        title: `Modifier ${roleplay.value?.title ?? ''}`,
    })

    form.value = {
        id: roleplay.value.id,
        title: roleplay.value.title,
        description: roleplay.value.description,
        startDate: roleplay.value.startDate,
        illustration: undefined,
    }

    roles.value = roleplay.value.roles.map(role => ({
        id: role.id,
        name: role.name,
        maxUsers: role.maxUsers,
        description: role.description,
        isFree: role.isFree,
    }))

    preview.value = roleplay.value.illustration

    loading.value = false
}

async function updateRoleplay() {
    if (!form.value) {
        return
    }

    loading.value = true
    try {
        await updateRP(form.value)
        toast?.showSuccess('Roleplay mis à jour avec succès')
    }
    catch (error) {
        toast?.showError('Une erreur est survenue lors de la mise à jour du roleplay')
        console.error(error)
    }
    finally {
        loading.value = false
    }
}

async function deleteRoleplay() {
    loading.value = true

    try {
        await deleteRP(rpId)
        toast?.showSuccess('Roleplay supprimé avec succès')
        router.push({ name: 'user-roleplays' })
    }
    catch {
        toast?.showError('Une erreur est survenue lors de la suppression du roleplay')
    }
    finally {
        loading.value = false
    }
}

function assignRoleRef(el: InstanceType<typeof RoleForm>, index: number) {
    rolesForms.value[index] = el
}

function addRole(free: boolean) {
    const newRole: CreateRoleVariables = {
        name: free ? 'Rôle libre' : '',
        maxUsers: 0,
        description: free ? 'Les utilisateurs qui choisiront ce rôle utiliseront leur propre profil comme personnage' : '',
        isFree: free,
        roleplay: roleplay.value?.id ?? '',
    }

    roles.value.push(newRole)
}

function removeRole(role: CreateRoleVariables | EditRoleVariables) {
    if ('id' in role) {
        deleteRoleId.value = role.id
        deleteRoleDialog.value = true
    }
    else {
        roles.value.splice(roles.value.indexOf(role), 1)
    }
}

async function deleteRole() {
    if (!deleteRoleId.value) {
        return
    }

    loading.value = true

    try {
        await deleteRoleQuery({ id: deleteRoleId.value })
        toast?.showSuccess('Rôle supprimé avec succès')
        getRoleplay()
        deleteRoleId.value = undefined
        deleteRoleDialog.value = false
    }
    catch {
        toast?.showError('Une erreur est survenue lors de la suppression du rôle')
    }
    finally {
        loading.value = false
    }
}

async function saveRoles() {
    if (!roleplay.value) {
        return
    }

    for (const role of roles.value) {
        if ('id' in role && !!role.id) {
            await editRoleQuery(role)
        }
        else {
            await createRoleQuery({
                ...role,
                roleplay: roleplay.value.id,
            })
        }
    }

    toast?.showSuccess('Rôles mis à jour avec succès')
    getRoleplay()
}

function isUsed(role: CreateRoleVariables | EditRoleVariables) {
    if (!('id' in role)) {
        return false
    }

    const foundRole = roleplay.value?.roles.find(r => r.id === role.id)

    if (!foundRole) {
        return false
    }

    return foundRole.nbCharacters[0]._count > 0
}

onMounted(getRoleplay)

const links = computed(() => ([
    {
        title: 'Accueil',
        to: '/',
    },
    {
        title: 'Mes roleplays',
        to: { name: 'user-roleplays' },
    },
    {
        title: `Modifier ${roleplay.value?.title ?? ''}`,
    },
]))
</script>

<template>
    <VContainer>
        <VForm>
            <VRow>
                <VCol>
                    <Breadcrumb :links />
                </VCol>
                <VCol class="d-flex justify-end align-center">
                    <VMenu>
                        <template #activator="{ props }">
                            <VBtn
                                v-bind="props"
                                append-icon="mdi-chevron-down"
                                variant="flat"
                            >
                                Actions
                            </VBtn>
                        </template>
                        <VList>
                            <VListItem
                                title="Accéder au roleplay"
                                append-icon="mdi-arrow-right-circle-outline"
                                @click="router.push({ name: 'roleplay-details', params: { id: roleplay?.id } })"
                            />

                            <VListItem
                                base-color="error"
                                append-icon="mdi-delete"
                                title="Supprimer le roleplay"
                                @click="showDeleteDialog = true"
                            />
                        </VList>
                    </VMenu>
                </VCol>
            </VRow>
            <MessageBoard
                v-if="roleplay"
                :message-board="roleplay.messageBoard"
                :roleplay-id="roleplay.id"
                :loading="loading"
                @saved="getRoleplay"
            />
            <VRow>
                <VCol>
                    <RoleplayForm
                        v-if="form"
                        v-model:form="form"
                        v-model:valid="valid"
                        v-model:new-illustration="newIllustration"
                        :loading="loading"
                        :current-preview="preview"
                        :edit="true"
                        @submit="updateRoleplay"
                    />
                </VCol>
            </VRow>
            <VRow v-if="roleplay">
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
                                <VRow v-if="roles.length > 0">
                                    <VCol
                                        v-for="(role, i) in roles"
                                        :key="i"
                                        cols="12"
                                        md="4"
                                    >
                                        <RoleForm
                                            :ref="(el) => el && assignRoleRef(el as InstanceType<typeof RoleForm>, i)"
                                            v-model:role="roles[i]"
                                            mode="update"
                                            :role-used="isUsed(role)"
                                            @update:valid="(v) => rolesValid[i] = v"
                                            @delete="removeRole(role)"
                                        />
                                    </VCol>
                                </VRow>
                                <VRow v-else>
                                    <VCol
                                        cols="12"
                                        md="4"
                                    >
                                        <VCard>
                                            <VEmptyState
                                                icon="mdi-badge-account-alert"
                                                title="Aucun rôle"
                                                text="Vous n'avez pas encore ajouté de rôle. Ajoutez un rôle pour commencer."
                                            >
                                                <template #actions>
                                                    <VBtn
                                                        prepend-icon="mdi-plus"
                                                        color="primary"
                                                        variant="flat"
                                                        @click="addRole(false)"
                                                    >
                                                        Ajouter un rôle
                                                    </vbtn>
                                                </template>
                                            </VEmptyState>
                                        </VCard>
                                    </VCol>
                                </VRow>
                            </VContainer>
                        </template>
                        <template #actions>
                            <VSpacer />
                            <VBtn
                                :disabled="!allRolesValid"
                                color="primary"
                                variant="flat"
                                @click="saveRoles"
                            >
                                Enregistrer
                            </VBtn>
                        </template>
                    </VCard>
                </VCol>
            </VRow>
        </VForm>
    </VContainer>
    <VDialog
        v-model="showDeleteDialog"
        width="500"
    >
        <VCard
            title="Supprimer le roleplay ?"
            prepend-icon="mdi-delete"
        >
            <template #text>
                La suppression du RP supprimera également les canaux de discussions, rôles, personnages, messages et médias liés. <br>
                Confirmer ?
            </template>
            <template #actions>
                <VSpacer />
                <VBtn
                    :color="undefined"
                    @click="showDeleteDialog = false"
                >
                    Annuler
                </VBtn>
                <VBtn
                    color="error"
                    @click="deleteRoleplay"
                >
                    Supprimer
                </VBtn>
            </template>
        </VCard>
    </VDialog>
    <VDialog
        v-model="deleteRoleDialog"
        width="500"
    >
        <VCard
            title="Supprimer le rôle ?"
            prepend-icon="mdi-delete"
        >
            <template #text>
                La suppression du rôle est irréversible. <br>
                Confirmer ?
            </template>
            <template #actions>
                <VSpacer />
                <VBtn
                    :color="undefined"
                    @click="deleteRoleDialog = false"
                >
                    Annuler
                </VBtn>
                <VBtn
                    color="error"
                    variant="flat"
                    @click="deleteRole"
                >
                    Supprimer
                </VBtn>
            </template>
        </VCard>
    </VDialog>
</template>
