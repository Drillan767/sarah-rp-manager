<script setup lang="ts">
import type { GetRoleplayData, UpdateRoleplayVariables } from '@sarah-rp-manager/default-connector'
import { useHead } from '@vueuse/head'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import RoleplayForm from '@/components/roleplays/RoleplayForm.vue'
import useRoleplays from '@/composables/roleplays'
import MessageBoard from './MessageBoard.vue'

const route = useRoute()
const router = useRouter()

const rpId = route.params.rpId.toString()

const { updateRP, getRP } = useRoleplays()

const roleplay = ref<GetRoleplayData['roleplay']>()
const loading = ref(false)
const valid = ref(false)
const preview = ref<string>()
const form = ref<UpdateRoleplayVariables>()

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
        illustration: roleplay.value.illustration,
    }

    preview.value = roleplay.value.illustration

    loading.value = false
}

async function updateRoleplay() {
    loading.value = true
    await updateRP(form.value)
    loading.value = false
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
                        :loading="loading"
                        :current-preview="preview"
                        :edit="true"
                        @submit="updateRoleplay"
                    />
                </VCol>
            </VRow>
        </VForm>
    </VContainer>
</template>
