<script setup lang="ts">
import type { Tables } from '~/types/supabase'

type Roleplay = Tables<'roleplays'> & {
    roles?: Tables<'roles'>[]
}

interface Props {
    modelValue: boolean
    roleplay: Roleplay
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const { t } = useI18n()

const valueData = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
})
</script>

<template>
    <VDialog
        v-model="valueData"
        width="960"
    >
        <VCard>
            <VImg
                :src="roleplay.illustration"
                class="align-end"
                height="400"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                cover
            />

            <VCardTitle>
                <VIcon
                    icon="mdi-book-open-page-variant-outline"
                />

                {{ roleplay.title }}
            </VCardTitle>
            <VCardText>
                <div v-html="roleplay.description" />
                <VContainer>
                    <VRow>
                        <VCol
                            v-for="(role, i) in roleplay.roles"
                            :key="i"
                        >
                            <VCard
                                :title="role.name"
                                :text="role.description"
                                class="h-100 d-flex flex-column"
                            />
                        </VCol>
                    </VRow>
                </VContainer>
            </VCardText>
            <VCardActions>
                <VSpacer />
                <VBtn
                    @click="valueData = false"
                >
                    {{ t('form.close') }}
                </VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
</template>
