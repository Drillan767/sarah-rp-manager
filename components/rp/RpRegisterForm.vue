<script setup lang="ts">
import Step1 from './register/Step1.vue'
import ReuseCharacterForm from './register/ReuseCharacterForm.vue'
import CreateCharacterForm from './register/CreateCharacterForm.vue'
import type { Database } from '~/types/supabase'
import type { Roleplay } from '~/types/models'
import useSnackBar from '~/composables/snackbar'
import { useCurrentUser } from '~/composables/currentUser'

interface RoleDetail {
    id: number
    name: string
    description: string
    max_users: number
    characters: any[]
}

interface RPDetail extends Omit<Roleplay, 'roles'> {
    roles: RoleDetail[]
    user: {
        id: number
        username: string
    } | null
}

interface UserCharacter {
    id: number
    name: string
    description: string
    illustration: string
    role_id: number
    user_id: number
}

interface CharacterFormType {
    name: string
    description: string
    role_id: number
    illustration: File | null
    status: number
}

const props = defineProps<{
    roleplay: RPDetail
    show: boolean
}>()

const { t } = useI18n()
const supabase = useSupabaseClient<Database>()
const currentUser = useCurrentUser()
const { showSuccess } = useSnackBar()

const creationDecision = ref<'reuse' | 'create'>('reuse')
const userCharacters = ref<UserCharacter[]>([])
const selectedCharacter = ref<UserCharacter>()
const showAuthModale = ref(false)
const formValid = ref(false)
const currentStep = ref(1)
const preview = ref('')
const loading = ref(false)

const characterForm = ref<CharacterFormType>({
    name: '',
    description: '',
    role_id: 0,
    illustration: null,
    status: 0,
})

const steps = [
    t('pages.roleplays.registration.step1'),
    t('pages.roleplays.registration.step2'),
    t('pages.roleplays.registration.step3'),
]

async function fetchCharactersList() {
    const { data } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', currentUser.value.id)

    if (data) {
        userCharacters.value = data
        selectedCharacter.value = data[0]
    }
}

async function submit() {
    loading.value = true
    const formData = new FormData()
    formData.append('action', creationDecision.value)
    formData.append('name', characterForm.value.name)
    formData.append('description', characterForm.value.description)
    formData.append('user_id', currentUser.value.id.toString())
    formData.append('role_id', characterForm.value.role_id.toString())
    formData.append('status', '0')

    if (creationDecision.value === 'create' && characterForm.value.illustration)
        formData.append('illustration', characterForm.value.illustration)

    else
        formData.append('illustration', preview.value)

    await useFetch('/api/rp/register', {
        method: 'POST',
        body: formData,
    })

    loading.value = false

    close()
    showSuccess(t('pages.roleplays.registration.success'))
}

onMounted(() => {
    if (currentUser.value.id === 0)
        showAuthModale.value = true
})

watch(() => props.show, async (value) => {
    if (value)
        await fetchCharactersList()
})

watch(currentUser, async (value) => {
    if (value.id !== 0)
        await fetchCharactersList()
})
</script>

<template>
    <VDialog
        :model-value="show"
        width="750"
    >
        <VStepper
            v-model="currentStep"
            :items="steps"
            :prev-text="t('pages.roleplays.registration.prev')"
            :next-text="t('pages.roleplays.registration.next')"
        >
            <template #item.1>
                <Step1
                    v-model="characterForm.role_id"
                    v-model:form-valid="formValid"
                    :roles="roleplay.roles"
                    :characters="userCharacters"
                />
            </template>

            <template #item.2>
                <VItemGroup
                    v-model="creationDecision"
                    class="d-flex justify-space-evenly"
                    :mandatory="true"
                >
                    <VItem
                        v-slot="{ isSelected, toggle }"
                        value="reuse"
                    >
                        <VBtn
                            :variant="isSelected ? 'outlined' : undefined"
                            @click="toggle"
                        >
                            {{ t('pages.roleplays.registration.reuse') }}
                        </VBtn>
                    </VItem>
                    <VItem
                        v-slot="{ isSelected, toggle }"
                        value="create"
                    >
                        <VBtn
                            :variant="isSelected ? 'outlined' : undefined"
                            @click="toggle"
                        >
                            {{ t('pages.roleplays.registration.create') }}
                        </VBtn>
                    </VItem>
                </VItemGroup>
                <ReuseCharacterForm
                    v-if="creationDecision === 'reuse'"
                    v-model:form-valid="formValid"
                    :characters="userCharacters"
                />
                <CreateCharacterForm
                    v-if="creationDecision === 'create'"
                    v-model:form-valid="formValid"
                />
            </template>
            <template #item.3>
                <VCard elevation="2">
                    <VImg
                        class="align-end text-white"
                        :cover="true"
                        height="400"
                        :src="preview"
                    >
                        <VCardTitle>
                            {{ characterForm.name }}
                        </VCardTitle>
                    </VImg>
                    <v-card-subtitle class="pt-4">
                        {{ roleplay.roles.find((r) => r.id === characterForm.role_id)?.name ?? '' }}
                    </v-card-subtitle>
                    <VCardText>
                        {{ characterForm.description }}
                    </VCardText>
                </VCard>
            </template>

            <template #actions>
                <div class="v-stepper-actions">
                    <VBtn
                        :tonal="true"
                        :disabled="currentStep === 1"
                        @click="currentStep--"
                    >
                        {{ t('pages.roleplays.registration.prev') }}
                    </VBtn>
                    <VBtn
                        v-if="currentStep < 3"
                        :tonal="true"
                        :disabled="currentStep === steps.length || formValid === false"
                        @click="currentStep++"
                    >
                        {{ t('pages.roleplays.registration.next') }}
                    </VBtn>
                    <VBtn
                        v-else
                        :disabled="loading"
                        :loading="loading"
                        color="primary"
                        @click="submit"
                    >
                        {{ t('form.save') }}
                    </VBtn>
                </div>
            </template>
        </VStepper>
        <RpAuthModale v-model="showAuthModale" />
    </VDialog>
</template>
