<script setup lang="ts">
import type { Tables } from '@/types/database'
import { storeToRefs } from 'pinia'
import { useForm, useIsFormValid } from 'vee-validate'
import { onMounted, ref } from 'vue'
import useToast from '@/composables/toast'
import vuetifyConfig from '@/composables/vuetifyConfig'
import useUsersStore from '@/stores/auth'
import { getUserInfos, updateDescription } from '@/util/repositories/users'

type User = Tables<'users'>

const { user } = storeToRefs(useUsersStore())
const { showSuccess, showError } = useToast()

const loading = ref(false)
const storedUser = ref<User>()

const { defineField, handleSubmit } = useForm<{ description: string }>({
    initialValues: {
        description: storedUser.value?.description ?? '',
    },
})

const formValid = useIsFormValid()

const [description, descriptionProps] = defineField('description', vuetifyConfig)

async function loadCurrentUserInfos() {
    if (!user.value)
        return
    loading.value = true
    const data = await getUserInfos(user.value.id)
    if (data) {
        storedUser.value = data
    }
    else {
        showError('Une erreur est survenue lors de la récupération des informations du profil')
    }
    loading.value = false
}

const save = handleSubmit(async (values) => {
    if (!storedUser.value || !user.value)
        return

    loading.value = true

    try {
        await updateDescription(user.value.id, values.description)
        showSuccess('Informations mises à jour avec succès')
    }
    catch (error) {
        console.error(error)
        showError('Une erreur est survenue lors de la mise à jour des informations du profil')
    }
    finally {
        loading.value = false
    }
})

onMounted(loadCurrentUserInfos)
</script>

<template>
    <VCard
        :loading="loading"
        prepend-icon="mdi-account"
        title="Profil"
        variant="flat"
        class="mb-4"
    >
        <template #text>
            <VForm>
                <VRow>
                    <VCol cols="12" md="6">
                        <VTextField
                            :model-value="storedUser?.username"
                            label="Pseudo"
                            disabled
                        />
                    </VCol>
                    <VCol cols="12" md="6">
                        <VTextField
                            :model-value="storedUser?.handle"
                            label="Identifiant"
                            disabled
                        />
                    </VCol>
                </VRow>
                <VRow>
                    <VCol>
                        <VTextarea
                            v-bind="descriptionProps"
                            v-model="description"
                            label="Description"
                            :auto-grow="true"
                        />
                    </VCol>
                </VRow>
            </VForm>
        </template>
        <template #actions>
            <VSpacer />
            <VBtn
                color="primary"
                variant="flat"
                :disabled="!formValid || loading"
                @click="save"
            >
                Enregistrer
            </VBtn>
        </template>
    </VCard>
</template>
