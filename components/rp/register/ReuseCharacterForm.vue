<script setup lang="ts">
interface UserCharacter {
    id: number
    name: string
    description: string
    illustration: string
    role_id: number
    user_id: number
}

interface Props {
    characters: UserCharacter[]
}

defineProps<Props>()

const emit = defineEmits<{ (e: 'update:formValid', value: boolean): void }>()

const { t } = useI18n()

const { defineField } = useForm<{ character: UserCharacter }>({
    validationSchema: {
        character: 'required',
    },
})

const [character, characterProps] = defineField('character', vuetifyConfig)

const formValid = useIsFormValid()

watch(formValid, value => emit('update:formValid', value))
</script>

<template>
    <VSelect
        v-bind="characterProps"
        v-model="character"
        label="Personnage existant"
        :items="characters"
        :return-object="true"
        item-title="name"
        item-value="id"
        class="my-4"
        :no-data-text="t('pages.roleplays.registration.no_character')"
    >
        <template #item="{ props: select, item }">
            <VListItem
                v-bind="select"
                :prepend-avatar="item.raw.illustration"
            />
        </template>
    </VSelect>
</template>
