<script setup lang="ts">
import { ErrorMessage, Field, Form, configure, defineRule } from 'vee-validate'

defineProps<{ show: boolean }>()

const currentStep = ref(1)

async function submit() {
    // ...
}
</script>

<template>
    <dialog
        class="modal"
        :class="{ 'modal-open': show }"
    >
        <div class="modal-box w-11/12 max-w-5xl">
            <Form @submit="submit">
                <h3 class="font-bold text-lg mb-4">
                    Inscription à un roleplay
                </h3>
                <div class="flex justify-center">
                    <ul class="steps steps-vertical lg:steps-horizontal">
                        <li
                            class="step"
                            :class="{ 'step-primary': currentStep >= 1 }"
                        >
                            Détails et rôle
                        </li>
                        <li
                            class="step"
                            :class="{ 'step-primary': currentStep >= 2 }"
                        >
                            Sélection du personnage
                        </li>
                        <li
                            class="step"
                            :class="{ 'step-primary': currentStep >= 2 }"
                        >
                            Fin
                        </li>
                    </ul>
                </div>

                <div v-if="currentStep === 1">
                    <p>Etape 1</p>
                </div>
                <div v-if="currentStep === 2">
                    <p>Etape 2</p>
                </div>
                <div v-if="currentStep === 3">
                    <p>Etape 3</p>
                </div>

                <div class="w-full mb-4">
                    <ErrorMessage
                        name="newPassword"
                        class="text-red-500"
                    />
                </div>
            </Form>
            <div class="flex justify-end">
                <button
                    class="btn btn-primary"
                    @click="currentStep++"
                >
                    Suivant
                </button>
            </div>
        </div>
    </dialog>
</template>
