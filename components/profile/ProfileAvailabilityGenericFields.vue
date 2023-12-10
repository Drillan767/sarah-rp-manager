<script setup lang="ts">
import type { GenericDate } from '~/types/models'
import useAvailabilities from '~/composables/availabilities'
import { days } from '~/assets/json/availability-time.json'

interface Props {
    maxHours: number
    availability: GenericDate
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'update:availability', value: GenericDate): void
    (e: 'hasError', value: boolean): void
}>()

const { t } = useI18n()
const { halfHoursBetween } = useAvailabilities()

const daysList = days.map(d => ({
    title: t(`weekdays.${d}`),
    value: d,
}))

const currentAvailability = computed({
    get: () => props.availability,
    set: value => emit('update:availability', value),
})

const invalidRange = computed(() => {
    const {
        begin: { day: beginDay, hour: beginHour },
        end: { day: endDay, hour: endHour },
    } = currentAvailability.value

    const bdIndex = days.findIndex((d: string) => d === beginDay)

    const { newDay, halfHours: nbHalfHours } = halfHoursBetween(beginHour, endHour)

    if (`${beginDay} ${beginHour}` === `${endDay} ${endHour}`)
        return t('pages.profile.error.30mn')

    // Returns true if both beginDay and endDay are different while newDay is false.
    const differentDays = !newDay && beginDay !== endDay

    // Returns true if newDay is true, but beginDay and endDay are not following each other.
    const daysNotFollowing = newDay && (
        bdIndex !== days.length - 1
            ? days[bdIndex + 1] !== endDay
            : endDay !== days[0]
    )

    // Returns true if nbHalfHours exceeds max halfHours.
    const tooMuchHours = nbHalfHours > props.maxHours

    if ([differentDays, daysNotFollowing, tooMuchHours].includes(true))
        return t('pages.profile.error.maxHour', { maxHours: props.maxHours })

    return null
})

watch(invalidRange, (value) => {
    emit('hasError', value !== null)
})
</script>

<template>
    <div>
        <VAlert
            v-if="invalidRange"
            density="compact"
            type="warning"
            :text="invalidRange"
            class="mb-4"
        />
        <p class="text-subtitle-1">
            Début
        </p>
        <VSelect
            v-model="currentAvailability.begin.day"
            label="Jour"
            :items="daysList"
            item-title="title"
            item-value="value"
        />
        <VSelect
            v-model="currentAvailability.begin.hour"
            label="Heure"
            :items="hours"
        />

        <VDivider class="border-opacity-100 mb-4" />

        <p class="text-subtitle-1">
            Fin
        </p>

        <VSelect
            v-model="currentAvailability.end.day"
            label="Jour"
            :items="daysList"
            item-title="title"
            item-value="value"
        />
        <VSelect
            v-model="currentAvailability.end.hour"
            label="Heure"
            :items="hours"
        />
    </div>
</template>
