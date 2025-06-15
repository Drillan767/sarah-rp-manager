<script setup lang="ts">
import type { GetRoleplayData, ListTemplatesForUserData } from '@sarah-rp-manager/default-connector'

type Role = NonNullable<GetRoleplayData['roleplay']>['roles'][number]
type Template = NonNullable<ListTemplatesForUserData['character_templates']>[number]

const {
    role,
    character,
} = defineProps<{
    role: Role
    character: Template
}>()
</script>

<template>
    <VContainer>
        <VRow>
            <VCol>
                <h2>
                    Votre personnage
                </h2>

                <VCard>
                    <VImg
                        :src="character.illustration"
                        height="200"
                        cover
                    />
                    <VCardTitle>
                        {{ character.name }}
                    </VCardTitle>

                    <VCardText>
                        {{ character.description }}
                    </VCardText>
                </VCard>
            </VCol>
        </VRow>
        <VRow>
            <VCol>
                <h2>
                    Votre rôle
                </h2>

                <VCard
                    :title="role.name"
                    :text="role.description"
                />
            </VCol>
        </VRow>
    </VContainer>
</template>
