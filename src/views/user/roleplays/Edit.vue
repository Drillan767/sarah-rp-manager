<script setup lang="ts">
import type { GetRoleplayData } from '@sarah-rp-manager/default-connector'
import type { Toast } from '@/types'
import type { UpdateRoleplayFormType } from '@/types/forms'
import { useHead } from '@vueuse/head'
import { storeToRefs } from 'pinia'
import { computed, inject, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import RoleplayForm from '@/components/roleplays/RoleplayForm.vue'
import RolesForm from '@/components/roleplays/RolesForm.vue'
import useRoleplays from '@/composables/roleplays'
import useUsersStore from '@/stores/users'
import MessageBoard from './MessageBoard.vue'

// NOTE : Display roles only, no edition available HERE. Link to the roleplay's chat instead

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
const newIllustration = ref<File>()
const form = ref<UpdateRoleplayFormType>()

const freeRoleUsed = computed(() => roles.value.some(role => role.isFree))

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
        illustration: new File([], 'illustration.png'),
    }

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
                                <VRow>
                                    <VCol
                                        v-for="(_, i) in roles.length"
                                        :key="i"
                                        cols="12"
                                        md="4"
                                    >
                                        <RolesForm
                                            :ref="(el) => el && assignRoleRef(el as InstanceType<typeof RolesForm>, i)"
                                            v-model:form="roles[i]"
                                            @update:valid="(v) => rolesValid[i] = v"
                                            @delete="removeRole(i)"
                                        />
                                    </VCol>
                                </VRow>
                            </VContainer>
                        </template>
                        <template #actions>
                            <VSpacer />
                            <VBtn
                                prepend-icon="mdi-plus"
                                color="primary"
                                variant="flat"
                                @click="addRole(false)"
                            />
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
</template>
