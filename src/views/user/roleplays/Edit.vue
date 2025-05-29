<script setup lang="ts">
import type { GetRoleplayData } from '@sarah-rp-manager/default-connector'
import type { Toast } from '@/types'
import type { UpdateRoleplayFormType } from '@/types/forms'
import { useHead } from '@vueuse/head'
import { computed, inject, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import RoleplayForm from '@/components/roleplays/RoleplayForm.vue'
import useRoleplays from '@/composables/roleplays'
import MessageBoard from './MessageBoard.vue'

const route = useRoute()
const router = useRouter()
const toast = inject<Toast>('toast')

const rpId = route.params.rpId.toString()

const { updateRP, getRP, deleteRP } = useRoleplays()

const roleplay = ref<GetRoleplayData['roleplay']>()
const loading = ref(false)
const valid = ref(false)
const showDeleteDialog = ref(false)
const preview = ref<string>()
const newIllustration = ref<File>()
const form = ref<UpdateRoleplayFormType>()

async function getRoleplay() {
    loading.value = true
    roleplay.value = await getRP(rpId)

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
                            >
                                Actions
                            </VBtn>
                        </template>
                        <VList>
                            <VListItem
                                title="Accéder au roleplay"
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
