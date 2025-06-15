<script setup lang="ts">
import type { GetRoleplayData, ListParticipationsForUserData, ListTemplatesForUserData } from '@sarah-rp-manager/default-connector'
import { createParticipation } from '@sarah-rp-manager/default-connector'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import useUsersStore from '@/stores/users'
import ParticipationStep1 from './ParticipationStep1.vue'
import ParticipationStep2 from './ParticipationStep2.vue'
import ParticipationStep3 from './ParticipationStep3.vue'
import ParticipationStep4 from './ParticipationStep4.vue'

type Roleplay = GetRoleplayData['roleplay']
type Templates = NonNullable<ListTemplatesForUserData['character_templates']>
type Participations = NonNullable<ListParticipationsForUserData['participations']>

interface Props {
    roleplay: Roleplay
    characters: Templates
    participations: Participations
    role?: string
}

const {
    roleplay,
    role,
    characters,
} = defineProps<Props>()

const emit = defineEmits<{
    (e: 'joined'): void
}>()
const open = defineModel<boolean>('open', { required: true })
const { user } = storeToRefs(useUsersStore())

const step1 = ref<InstanceType<typeof ParticipationStep1>>()
const step2 = ref<InstanceType<typeof ParticipationStep2>>()
const step3 = ref<InstanceType<typeof ParticipationStep3>>()

const currentStep = ref(0)
const pickedRoleId = ref<string>()
const pickedCharacter = ref<string>()
const clonedCharacter = ref<Templates[number]>()
const loading = ref(false)

const headers = [
    {
        title: 'Choisissez un rôle',
        text: 'Vous pouvez choisir un rôle parmi ceux disponibles, mais vous ne pouvez pas choisir plusieurs fois le même rôle.',
    },
    {
        title: 'Choisissez un personnage',
        text: 'Vous pouvez choisir un personnage ou le créer pour l\'occasion.',
    },
    {
        title: 'Personnalisation',
        text: 'Rajoutez des informations supplémentaires à votre personnage.',
    },
    {
        title: 'Récapitulatif',
        text: 'Vérifiez vos choix et cliquez sur "Rejoindre le roleplay" pour finaliser votre inscription.',
    },
]

const currentStepInfos = computed(() => headers[currentStep.value])
const pickedRole = computed(() => roleplay?.roles.find(r => r.id === pickedRoleId.value))
const characterName = computed(() => characters.find(c => c.id === pickedCharacter.value)?.name ?? undefined)
const canProgress = computed(() => {
    if (currentStep.value === 0) {
        return step1.value?.valid
    }
    if (currentStep.value === 1) {
        return step2.value?.formValid
    }
    if (currentStep.value === 2) {
        return step3.value?.formValid
    }
    return true
})

function createCharacter() {
    clonedCharacter.value = {
        id: '',
        name: '',
        description: '',
        illustration: '',
        participations: [],
    }
    currentStep.value = 2
}

function reset() {
    currentStep.value = 0
    pickedRoleId.value = undefined
    pickedCharacter.value = undefined
    clonedCharacter.value = undefined
}

async function joinRoleplay() {
    if (!user.value || !roleplay || !pickedRoleId.value || !pickedCharacter.value) {
        return
    }

    loading.value = true

    try {
        await createParticipation({
            user: user.value.id,
            roleplay: roleplay.id,
            role: pickedRoleId.value,
            characterTemplate: pickedCharacter.value,
        })

        emit('joined')
        reset()
        open.value = false
    }
    catch (e) {
        console.error(e)
    }
    finally {
        loading.value = false
    }
}

watch([open, () => role], ([o, r]) => {
    if (o && r) {
        pickedRoleId.value = r
    }
})

watch(pickedCharacter, (char) => {
    if (char) {
        clonedCharacter.value = characters.find(c => c.id === char)
    }
})

/*
0.
[DONE] On roleplay detail page, we must check wether the user already has any participation for any role,
and disable said role if so (both in detail and in this component)

1.
[DONE] If user clicked on an available role, retrieve said role and skip directly to step 2
Otherwise, display a list of available roles

2.
If user is visitor, display a simple dialog telling them to create an account, redirect to this page
If user has at least one character model, display a list of them, but add a button to create a new one
If user has no character model, display the template form. When saving, create the character at the same time.

3.
[DONE] Display a recap containing both the role detail and the character detail.
[DONE] Clicking on "Join" will create the participation and redirect to the roleplay discussion page.
*/
</script>

<template>
    <VDialog
        v-model="open"
        max-width="900"
        persistent
    >
        <VCard>
            <VCardTitle>
                <h2 class="text-h5">
                    {{ currentStepInfos.title }}
                </h2>
            </VCardTitle>
            <VCardText>
                <p>{{ currentStepInfos.text }}</p>

                <VStepper
                    v-model="currentStep"
                    class="elevation-0"
                >
                    <VStepperHeader class="elevation-0">
                        <VStepperItem
                            :value="0"
                            title="Choix du rôle"
                            :subtitle="pickedRole?.name"
                            icon="mdi-badge-account"
                        />
                        <VDivider />
                        <VStepperItem
                            :subtitle="characterName"
                            :value="1"
                            icon="mdi-account-box-outline"
                            title="Choix du personnage"
                        />
                        <VDivider />
                        <VStepperItem
                            :value="2"
                            icon="mdi-account-box-edit-outline"
                            title="Personnalisation"
                        />
                        <VDivider />
                        <VStepperItem
                            :value="3"
                            title="Récapitulatif"
                            icon="mdi-check"
                        />
                    </VStepperHeader>
                    <VStepperWindow>
                        <VStepperWindowItem
                            :value="0"
                        >
                            <ParticipationStep1
                                ref="step1"
                                v-model="pickedRoleId"
                                :roles="roleplay?.roles ?? []"
                                :participations="participations"
                            />
                        </VStepperWindowItem>
                        <VStepperWindowItem
                            :value="1"
                        >
                            <ParticipationStep2
                                v-if="pickedRoleId"
                                ref="step2"
                                v-model="pickedCharacter"
                                :roleplay="roleplay?.id ?? ''"
                                :role="pickedRoleId"
                                :characters="characters"
                                @create-character="createCharacter"
                            />
                        </VStepperWindowItem>
                        <VStepperWindowItem
                            :value="2"
                        >
                            <ParticipationStep3
                                v-if="clonedCharacter"
                                ref="step3"
                                :cloned-character="clonedCharacter"
                            />
                        </VStepperWindowItem>
                        <VStepperWindowItem
                            :value="3"
                        >
                            <ParticipationStep4
                                v-if="pickedRole && clonedCharacter"
                                :role="pickedRole"
                                :character="clonedCharacter"
                            />
                        </VStepperWindowItem>
                    </VStepperWindow>
                </VStepper>
            </VCardText>
            <VCardActions>
                <VBtn
                    @click="open = false"
                >
                    Annuler
                </VBtn>
                <VSpacer />
                <VBtn
                    v-if="currentStep > 0"
                    @click="currentStep--"
                >
                    Précédent
                </VBtn>
                <VBtn
                    v-if="currentStep < 3"
                    color="primary"
                    variant="flat"
                    :disabled="!canProgress"
                    @click="currentStep++"
                >
                    Suivant
                </VBtn>
                <VBtn
                    v-else
                    color="primary"
                    variant="flat"
                    :disabled="loading"
                    @click="joinRoleplay"
                >
                    Rejoindre le roleplay
                </VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
</template>
