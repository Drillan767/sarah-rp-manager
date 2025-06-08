<script setup lang="ts">
import type { CreateParticipationVariables, GetRoleplayData } from '@sarah-rp-manager/default-connector'
import type { ParticipationCharacter, ParticipationRole } from '@/types/forms'
import { computed, onMounted, ref, watch } from 'vue'
import ParticipationStep1 from './ParticipationStep1.vue'

type Roleplay = GetRoleplayData['roleplay']

interface Props {
    roleplay: Roleplay
    role?: string
}

const {
    roleplay,
    role,
} = defineProps<Props>()

const form = ref<CreateParticipationVariables>()

const open = defineModel<boolean>('open', { required: true })

const step1 = ref<InstanceType<typeof ParticipationStep1>>()

const currentStep = ref(0)
const pickedRole = ref<string>()
const pickedCharacter = ref<ParticipationCharacter>()

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
        title: 'Récapitulatif',
        text: 'Vérifiez vos choix et cliquez sur "Rejoindre le roleplay" pour finaliser votre inscription.',
    },
]

watch([open, () => role], ([o, r]) => {
    if (o && r) {
        pickedRole.value = r
    }
})

const currentStepInfos = computed(() => headers[currentStep.value])
const roleName = computed(() => roleplay?.roles.find(r => r.id === pickedRole.value)?.name ?? undefined)

/*
0.
[DONE] On roleplay detail page, we must check wether the user already has any participation for any role,
and disable said role if so (both in detail and in this component)

1.
[DONE]If user clicked on an available role, retrieve said role and skip directly to step 2
Otherwise, display a list of available roles

2.
If user is visitor, display a simple dialog telling them to create an account, redirect to this page
If user has at least one character model, display a list of them, but add a button to create a new one
If user has no character model, display the template form. When saving, create the character at the same time.

3.
Display a recap containing both the role detail and the character detail.
Clicking on "Join" will create the participation and redirect to the roleplay discussion page.
*/
</script>

<template>
    <VDialog
        v-model="open"
        max-width="800"
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
                            title="Choix du rôle"
                            icon="mdi-badge-account"
                            :subtitle="roleName"
                            :value="0"
                        />
                        <VDivider />
                        <VStepperItem
                            icon="mdi-account-box-outline"
                            title="Choix du personnage"
                            :subtitle="pickedCharacter?.name ?? undefined"
                            :value="1"
                        />
                        <VDivider />
                        <VStepperItem
                            title="Récapitulatif"
                            icon="mdi-check"
                            :value="2"
                        />
                    </VStepperHeader>
                    <VStepperWindow>
                        <VStepperWindowItem
                            :value="0"
                        >
                            <ParticipationStep1
                                ref="step1"
                                v-model="pickedRole"
                                :roles="roleplay?.roles ?? []"
                            />
                        </VStepperWindowItem>
                    </VStepperWindow>
                </VStepper>
            </VCardText>
            <VCardActions>
                <VSpacer />
                <VBtn
                    @click="open = false"
                >
                    Annuler
                </VBtn>
                <VBtn
                    color="primary"
                    @click="currentStep++"
                >
                    Suivant
                </VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
</template>
