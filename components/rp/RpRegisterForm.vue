<script setup lang="ts">
import type { Database } from '~/types/supabase'
import type { Roleplay } from '~/types/models'
import useSnackBar from '~/composables/snackbar'
import { useCurrentUser } from '~/composables/currentUser'
import useValidation from '~/composables/useValidation'

interface RoleDetail {
    id: number,
    name: string,
    description: string,
    max_users: number,
    characters: any[]
}

interface RPDetail extends Omit<Roleplay, 'roles'> {
    roles: RoleDetail[],
    user: {
        id: number,
        username: string,
    } | null
}

interface UserCharacter {
    id: number,
    name: string,
    description: string,
    illustration: string,
    role_id: number,
    user_id: number,
}

interface CharacterFormType {
    name: string,
    description: string,
    role_id: number,
    illustration: File | null,
    status: number,
}

const props = defineProps<{
    roleplay: RPDetail,
    show: boolean,
}>()

const emit = defineEmits<{
    (e: 'close'): void,
}>()

const { t } = useI18n()
const supabase = useSupabaseClient<Database>()
const currentUser = useCurrentUser()
const { requiredRule, imageRule } = useValidation()
const { showSuccess } = useSnackBar()

const showAuthModale = ref(false)
const currentStep = ref(1)
const preview = ref('')
const showPreviewModal = ref(false)
const loading = ref(false)
const userCharacters = ref<UserCharacter[]>([])
const selectedCharacter = ref<UserCharacter>()
const creationDecision = ref<'reuse' | 'create'>('reuse')
const formValid = ref<boolean>()

const steps = [
    t('pages.roleplays.registration.step1'),
    t('pages.roleplays.registration.step2'),
    t('pages.roleplays.registration.step3'),
]

const characterForm = ref<CharacterFormType>({
    name: '',
    description: '',
    role_id: 0,
    illustration: null,
    status: 0,
})

const cantProceed = computed(() => {
    if (currentStep.value === 1) return [undefined, 0].includes(characterForm.value.role_id)
    if (currentStep.value === 2) {
        return creationDecision.value === 'create'
            ? characterForm.value.name === '' || characterForm.value.description === '' || characterForm.value.illustration === null
            : selectedCharacter.value === undefined || !('id' in selectedCharacter.value)
    }

    return false
})

onMounted(() => {
    if (currentUser.value.id === 0) {
        showAuthModale.value = true
    }
})

const roleUnavailble = (role: RoleDetail) => {
    if (role.max_users - role.characters[0] === 0) return true

    const characterRolesId = userCharacters.value.map((uc) => uc.role_id)
    const rpRolesId = props.roleplay.roles.map((r) => r.id)
    const commonIds = characterRolesId.filter((x) => rpRolesId.includes(x))

    return commonIds.includes(role.id)
}

const handleImage = (e: Event) => {
    const files = (e.target as HTMLInputElement).files

    if (files) {
        preview.value = URL.createObjectURL(files[0])
        characterForm.value.illustration = files[0]
    }
}

const submit = async() => {
    loading.value = true
    const formData = new FormData()
    formData.append('action', creationDecision.value)
    formData.append('name', characterForm.value.name)
    formData.append('description', characterForm.value.description)
    formData.append('user_id', currentUser.value.id.toString())
    formData.append('role_id', characterForm.value.role_id.toString())
    formData.append('status', '0')

    if (creationDecision.value === 'create' && characterForm.value.illustration)  {
        formData.append('illustration', characterForm.value.illustration)
    } else {
        formData.append('illustration', preview.value)
    }

    await useFetch('/api/rp/register', {
        method: 'POST',
        body: formData,
    })

    loading.value = false

    close()
    showSuccess(t('pages.roleplays.registration.success'))
}

const close = () => {
    emit('close')
    currentStep.value = 1
    preview.value = ''
    userCharacters.value = []
    characterForm.value = {
        name: '',
        description: '',
        role_id: 0,
        illustration: null,
        status: 0,
    }
}

const fetchCharactersList = async() => {
    const { data } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', currentUser.value.id)

    if (data) {
        userCharacters.value = data
        selectedCharacter.value = data[0]
    }
}

const handleLogin = () => {
    showAuthModale.value = false
}

watch(() => props.show, async (value) => {
    if (value) await fetchCharactersList()
})

watch(currentUser, async (value) => {
    if (value.id !== 0) await fetchCharactersList()
})

watch(selectedCharacter, (value) => {
    if (value) {
        preview.value = value.illustration
        characterForm.value.name = value.name
        characterForm.value.description = value.description
    }
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
                <VItemGroup
                    v-model="characterForm.role_id"
                    :mandatory="true"
                >
                    <VItem
                        v-for="(role, i) in roleplay.roles"
                        :key="i"
                        v-slot="{ isSelected, toggle }"
                        :value="role.id"
                    >
                        <VCard
                            color="blue"
                            :variant="isSelected ? 'flat' : 'outlined' "
                            :disabled="roleUnavailble(role)"
                            class="mb-2"
                            @click="toggle"
                        >
                            <template #title>
                                {{ role.name }}
                            </template>
                            <template #text>
                                {{ role.description }}
                            </template>
                        </VCard>
                    </VItem>
                </VItemGroup>
            </template>

            <template #item.2>
                <div class="d-flex mb-4 justify-space-around ">
                    <VBtn
                        :variant="creationDecision === 'reuse' ? 'outlined' : undefined"
                        @click="creationDecision = 'reuse'"
                    >
                        {{ t('pages.roleplays.registration.reuse') }}
                    </VBtn>
                    <VBtn
                        :variant="creationDecision === 'create' ? 'outlined' : undefined"
                        @click="creationDecision = 'create'"
                    >
                        {{ t('pages.roleplays.registration.create') }}
                    </VBtn>
                </div>
                <VForm
                    v-if="creationDecision === 'create'"
                    v-model="formValid"
                >
                    <VTextField
                        :label="t('fields.name')"
                        color="primary"
                        variant="outlined"
                        :rules="[requiredRule]"
                        v-model="characterForm.name"
                    />

                    <div class="d-flex">
                        <VFileInput
                            :class="{ 'mr-5': preview !== '' }"
                            label="Illustration"
                            color="primary"
                            variant="outlined"
                            accept="image/*"
                            :clearable="true"
                            prepend-icon="mdi-image-album"
                            :rules="[imageRule(false, characterForm.illustration)]"
                            hint="max: 2 mb"
                            @change="handleImage"
                        />
                        <VBtn
                            v-if="preview !== ''"
                            color="primary"
                            variant="outlined"
                            icon="mdi-image-area"
                            @click.prevent="showPreviewModal = true"
                        />
                    </div>
                    <VTextarea
                        label="Description"
                        variant="outlined"
                        v-model="characterForm.description"
                        :auto-grow="true"
                        rows="2"
                        color="primary"
                    />
                </VForm>
                <div v-if="creationDecision === 'reuse'">
                    <VSelect
                        variant="outlined"
                        label="Personnage existant"
                        v-model="selectedCharacter"
                        :items="userCharacters"
                        :return-object="true"
                        item-title="name"
                        item-value="id"
                        :no-data-text="t('pages.roleplays.registration.no_character')"
                        :rules="[requiredRule]"
                    >
                        <template #item="{ props, item }">
                            <VListItem
                                v-bind="props"
                                :prepend-avatar="item.raw.illustration"
                            />
                        </template>
                    </VSelect>
                </div>
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
<!--            <VStepperHeader>
                <VStepperItem
                    :complete="currentStep > 1"
                    :title="t('pages.roleplays.registration.step1')"
                    :subtitle="roleplay.roles.find((r) => r.id === characterForm.role_id)?.name ?? undefined"
                    value="1"
                />
                <VDivider />
                <VStepperItem
                    :complete="currentStep > 2"
                    :title="t('pages.roleplays.registration.step2')"
                    subtitle="On verra bien"
                    value="2"
                />
                <VDivider />
                <VStepperItem
                    :title="t('pages.roleplays.registration.step3')"
                    subtitle="On verra bien"
                    value="2"
                />
            </VStepperHeader>-->

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
                        :disabled="currentStep === steps.length || cantProceed || formValid === false"
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
        <VDialog
            v-model="showPreviewModal"
            max-width="600"
        >
            <VImg
                :src="preview"
                :width="600"
                aspect-ratio="16/9"
                :cover="true"
            />
        </VDialog>
        <AuthModale
            v-model:show="showAuthModale"
        />
    </VDialog>
</template>
