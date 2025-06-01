<script setup lang="ts">
import type { CreateCharacterVariables } from '@sarah-rp-manager/default-connector'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import useUsersStore from '@/stores/users'
import CharacterForm from './CharacterForm.vue'

interface Props {
    roleplayId: string
}

const props = defineProps<Props>()

defineEmits<{
    (e: 'saved'): void
}>()

const { user } = storeToRefs(useUsersStore())

const open = defineModel<boolean>({ required: true })

const character = ref<CreateCharacterVariables>({
    name: '',
    description: '',
    illustration: '',
    roleplay: props.roleplayId,
    user: user.value?.id ?? '',
})

const loading = ref(false)
</script>

<template>
    <VDialog
        v-model="open"
        max-width="500"
    >
        <VCard
            title="Créer un personnage"
            :loading="loading"
        >
            <CharacterForm
                v-model="character"
                :edit="false"
            />
        </VCard>
    </VDialog>
</template>
