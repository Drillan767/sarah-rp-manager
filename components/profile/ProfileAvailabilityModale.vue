<script setup lang="ts">
import type { GenericDate, SpecificDate } from '~/types/models'

interface Props {
    show: boolean
    modalType: 'create' | 'update'
    currentIndex?: number
    availabilityType: 'available' | 'unavailable'
    currentAvailability?: SpecificDate | GenericDate
}

interface AvailableDate {
    type: 'available'
    content: SpecificDate | GenericDate
}

interface UnavailableDate {
    type: 'unavailable'
    content: SpecificDate
}

type Payload = AvailableDate | UnavailableDate

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'addDate', value: Payload): void
    (e: 'save', value: Payload): any
    (e: 'update', value: { date: Payload, i: number }): void
    (e: 'close'): void
}>()

const maxHours = 15

const defaultGenericDate: GenericDate = {
    isSpecific: false,
    begin: {
        day: 'monday',
        hour: '00:00',
    },
    end: {
        day: 'monday',
        hour: '00:00',
    },
}

const defaultSPecificDate: SpecificDate = {
    isSpecific: true,
    begin: '',
    end: '',
}

const { t } = useI18n()
// const { } = useAvailabilities()

const genericAvailability = ref(defaultGenericDate)
const specificAvailability = ref(defaultSPecificDate)
const dateType = ref<number>(0)
const hasErrors = ref(true)

const isEditing = computed(() => props.currentAvailability !== undefined && props.currentIndex !== undefined)

watch(() => props.show, (value) => {
    if (value) {
        if (props.availabilityType === 'unavailable') {
            dateType.value = 1
            hasErrors.value = false
        }

        if (props.currentAvailability !== undefined && props.currentIndex !== undefined) {
            hasErrors.value = false

            if (props.currentAvailability.isSpecific) {
                specificAvailability.value = props.currentAvailability
                dateType.value = 1
            }
            else {
                genericAvailability.value = props.currentAvailability
            }
        }
    }
})

function close() {
    genericAvailability.value = defaultGenericDate
    specificAvailability.value = defaultSPecificDate
    dateType.value = 0
    hasErrors.value = false

    emit('close')
}

function save() {
    let payload: Payload

    // Regular availability.
    if (dateType.value === 0) {
        payload = {
            type: 'available',
            content: genericAvailability.value,
        }
    // Specific availability.
    }
    else {
        payload = {
            type: props.availabilityType,
            content: specificAvailability.value,
        }
    }

    if (isEditing.value)
        emit('update', { date: payload, i: props.currentIndex! })
    else
        emit('save', payload)

    close()
}

function handleErrorStatus(value: boolean) {
    hasErrors.value = value
}
</script>

<template>
    <VDialog
        :model-value="show"
        :persistent="true"
        width="550"
    >
        <VCard>
            <VCardTitle>
                <template v-if="isEditing">
                    {{ t('pages.profile.availabilities.edit') }}
                </template>
                <template v-else>
                    {{ t('pages.profile.availabilities.add') }}
                </template>

                <template v-if="availabilityType === 'available'">
                    {{ t('pages.profile.availabilities.self') }}
                </template>
                <template v-else>
                    {{ t('pages.profile.availabilities.unself') }}
                </template>
            </VCardTitle>
            <VCardItem>
                <VItemGroup
                    v-model="dateType"
                    :mandatory="true"
                >
                    <VContainer
                        :fluid="true"
                        class="px-0"
                    >
                        <VRow>
                            <VItem v-slot="{ isSelected, toggle }">
                                <VCol cols="12" md="6">
                                    <VBtn
                                        :variant="isSelected ? 'flat' : 'outlined'"
                                        color="blue"
                                        :block="true"
                                        :disabled="availabilityType === 'unavailable' || currentAvailability !== undefined"
                                        @click="toggle"
                                    >
                                        {{ t('pages.profile.availabilities.general') }}
                                    </VBtn>
                                </VCol>
                            </VItem>

                            <VItem v-slot="{ isSelected, toggle }">
                                <VCol cols="12" md="6">
                                    <VBtn
                                        :variant="isSelected ? 'flat' : 'outlined'"
                                        color="blue"
                                        :block="true"
                                        :disabled="availabilityType === 'unavailable' || currentAvailability !== undefined"
                                        @click="toggle"
                                    >
                                        {{ t('pages.profile.availabilities.specific') }}
                                    </VBtn>
                                </VCol>
                            </VItem>
                        </VRow>
                    </VContainer>
                </VItemGroup>

                <ProfileAvailabilityGenericFields
                    v-if="dateType === 0"
                    :max-hours="maxHours"
                    :availability="genericAvailability"
                    @has-error="handleErrorStatus"
                />
                <ProfileAvailabilitySpecificFields
                    v-if="dateType === 1"
                    :max-hours="maxHours"
                    :availability-type="availabilityType"
                    :availability="specificAvailability"
                    @has-error="handleErrorStatus"
                />
            </VCardItem>
            <VCardActions>
                <VSpacer />
                <VBtn @click="close">
                    {{ t('form.cancel') }}
                </VBtn>
                <VBtn
                    :disabled="hasErrors"
                    @click="save"
                >
                    {{ isEditing ? t('form.save') : t('form.add') }}
                </VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
</template>
