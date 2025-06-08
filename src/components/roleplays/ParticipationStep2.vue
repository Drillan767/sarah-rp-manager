<script setup lang="ts">
import type { ListTemplatesForUserData } from '@sarah-rp-manager/default-connector'
import { useForm, useIsFormValid } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import vuetifyConfig from '@/composables/vuetifyConfig'

type Templates = NonNullable<ListTemplatesForUserData['character_templates']>

const {
    characters,
    role,
    roleplay,
} = defineProps<{
    characters: Templates
    role: string
    roleplay: string
}>()

const pickedCharacter = defineModel<string>()

const tempCharacters = ref<Templates>([])

const charactersWithDisabled = computed(() => [
    ...characters.map(c => ({
        ...c,
        disabled: c.participations.some(p => p.roleplay.id === roleplay && p.roleplay.roles.some(r => r.id === role)),
    })),
    ...tempCharacters.value.map(c => ({
        ...c,
        disabled: false,
    })),
])

const { defineField } = useForm<{ character: string }>({
    validationSchema: {
        character: 'required',
    },
})

const [character, characterProps] = defineField('character', vuetifyConfig)

const formValid = useIsFormValid()

watch(character, (value) => {
    pickedCharacter.value = value
})

defineExpose({
    formValid,
})
</script>

<template>
    <VContainer>
        <VRow>
            <VCol>
                <VItemGroup
                    v-bind="characterProps"
                    v-model="pickedCharacter"
                >
                    <VContainer>
                        <VRow>
                            <VItem
                                v-for="(c, i) in charactersWithDisabled"
                                v-slot="{ isSelected, toggle }"
                                :key="i"
                                :value="c.id"
                            >
                                <VCol
                                    cols="12"
                                >
                                    <VCard
                                        :disabled="c.disabled"
                                        :variant="isSelected ? 'tonal' : 'outlined'"
                                        @click="toggle"
                                    >
                                        <div class="character-card">
                                            <div class="avatar">
                                                <VImg
                                                    :src="c.illustration"
                                                    :alt="c.name"
                                                    height="100%"
                                                    width="100%"
                                                    cover
                                                />
                                            </div>

                                            <div class="name">
                                                <VCardTitle>
                                                    {{ c.name }}
                                                </VCardTitle>
                                            </div>

                                            <div class="meta">
                                                <VIcon
                                                    v-if="isSelected"
                                                    icon="mdi-check-circle"
                                                />
                                            </div>

                                            <div class="description">
                                                <VCardText>
                                                    {{ c.description }}
                                                </VCardText>
                                            </div>
                                        </div>
                                    </VCard>
                                </VCol>
                            </VItem>
                        </VRow>
                    </VContainer>
                </VItemGroup>
            </VCol>
        </VRow>
        <VRow>
            <VCol class="d-flex justify-center">
                <VBtn
                    prepend-icon="mdi-plus"
                >
                    Nouveau personnage
                </VBtn>
            </VCol>
        </VRow>
    </VContainer>
</template>

<style scoped>
.character-card {
    display: grid;
    grid-template-columns: 20% 75% 5%;
    grid-template-rows: 50px 1fr;
}

.avatar {
    grid-area: 1 / 1 / 3 / 2;
}

.name {
    grid-area: 1 / 2 / 2 / 3;
}

.meta {
    grid-area: 1 / 3 / 2 / 4;
    display: flex;
    align-items: center;
}

.description {
    grid-area: 2 / 2 / 3 / 4;
}
</style>
