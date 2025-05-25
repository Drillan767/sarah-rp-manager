<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const display = useStorage('sarah-rp-first-visit', true)
</script>

<template>
    <VDialog
        v-model="display"
        :persistent="true"
        :fullscreen="true"
        :scrim="false"
        transition="dialog-bottom-transition"
    >
        <!--
        <VCard>
            <template #text>
                <VContainer>
                    <VRow>
                        <VCol class="d-flex flex-column align-center">
                            <VImg
                                src="/sarah.jpg"
                                :width="300"
                                :height="300"
                                aspect-ratio="1/1"
                            />
                            <h1 class="text-h3">
                                Le Jardin de Sarah
                            </h1>
                        </VCol>
                    </VRow>
                    <VRow>
                        <VCol>
                            <p>{{ t('p1') }}</p>
                            <p>{{ t('p2') }}</p>
                            <p>{{ t('p3') }}</p>
                        </VCol>
                    </VRow>
                    <VRow>
                        <VBtn
                            @click="display = false"
                        >
                            {{ t('ok') }}
                        </VBtn>
                    </VRow>
                </VContainer>
            </template>
        </VCard> -->
        <VImg
            src="/garden.jpg"
            :cover="true"
        >
            <div class="d-flex h-100 justify-center align-center ">
                <VCard
                    :max-width="750"
                    :width="750"
                    height="auto"
                >
                    <template #text>
                        <VContainer>
                            <VRow>
                                <VCol class="d-flex flex-column align-center">
                                    <VImg
                                        src="/sarah.jpg"
                                        :width="250"
                                        :height="250"
                                        aspect-ratio="1/1"
                                        class="rounded-circle"
                                    />
                                    <h1 class="text-h4">
                                        Le Jardin de Sarah
                                    </h1>
                                </VCol>
                            </VRow>
                            <VRow>
                                <VCol class="text-center">
                                    <p>
                                        Le Jardin de Sarah est un site présentant de nombreux roleplays, et de nombreux contenus à caractère érotique.
                                    </p>
                                    <p>
                                        Ce site ne convient pas à un public mineur.
                                    </p>
                                    <p>
                                        En entrant, vous déclarez être en âge légal de visionner ce type de contenu.
                                    </p>
                                </VCol>
                            </VRow>
                            <VRow>
                                <VBtn
                                    :block="true"
                                    color="primary"
                                    @click="display = false"
                                >
                                    Entrer
                                </VBtn>
                            </VRow>
                        </VContainer>
                    </template>
                </VCard>
            </div>
        </VImg>
    </VDialog>
</template>
