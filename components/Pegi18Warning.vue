<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const { t } = useI18n({
    useScope: 'local',
})

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
            src="https://images7.alphacoders.com/689/689877.jpg"
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
                                    <p>{{ t('p1') }}</p>
                                    <p>{{ t('p2') }}</p>
                                    <p>{{ t('p3') }}</p>
                                </VCol>
                            </VRow>
                            <VRow>
                                <VBtn
                                    :block="true"
                                    color="primary"
                                    @click="display = false"
                                >
                                    {{ t('ok') }}
                                </VBtn>
                            </VRow>
                        </VContainer>
                    </template>
                </VCard>
            </div>
        </VImg>
    </VDialog>
</template>

<i18n lang="json">
{
    "fr": {
        "p1": "Le Jardin de Sarah est un site présentant de nombreux roleplays, et de nombreux contenus à caractère érotique.",
        "p2": "Ce site ne convient pas à un public mineur",
        "p3": "En entrant, vous déclarez être en âge légal de visionner ce type ce contenu",
        "ok": "Entrer"
    },
    "en": {
        "p1": "Le Jardin de Sarah is a website containing several roleplays, and several erotic content.",
        "p2": "This website does not suit an underage public.",
        "p3": "By entering, you declare being in the legal age to watch this type of content.",
        "ok": "Enter"
    }
}
</i18n>
