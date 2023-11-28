<script setup lang="ts">
import type { SpecificDate } from '~/types/models'
import { useDebounceFn } from '@vueuse/core'

interface Props {
    maxHours: number,
    availabilityType: 'available' | 'unavailable',
    availability: SpecificDate
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'update:availability', value: SpecificDate): void,
    (e: 'hasError', value: boolean): void,
}>()

const { t } = useI18n()
const dayjs = useDayjs()

const minDate = dayjs().format('YYYY-MM-DDT00:00')

const currentAvailability = computed({
    get: () => props.availability,
    set: (value) => emit('update:availability', value)
})

const invalidRange = computed(() => {
    const { value: { begin, end } } = currentAvailability
    const before = dayjs(begin)
    const after = dayjs(end)

    if (after.isBefore(before)) return [t('pages.profile.error.isBefore')]
    if (after.diff(before, 'm') < 30) return [t('pages.profile.error.30mn')]
    if (dayjs().isAfter(before) || dayjs().isAfter(after)) return [t('pages.profile.error.isPast')]
    if (props.availabilityType === 'available' && after.diff(before, 'h') > props.maxHours) return [t('pages.profile.error.maxHour', { maxHours: props.maxHours})]

    return null
})

watch(invalidRange, (value) => {
    emit('hasError', value !== null)
})

const debounceRound = useDebounceFn((e: Event, type: 'begin' | 'end') => {
    const target = e.target as HTMLInputElement
    const ms = 1000 * 60 * 30
    const result = new Date(Math.round(new Date(target.value).getTime() / ms) * ms)
    const formattedResult = dayjs(result).format('YYYY-MM-DDTHH:mm')
    currentAvailability.value[type] = formattedResult
    target.value = formattedResult
}, 1000)

function toRound(e: Event, type: 'begin' | 'end') {
    debounceRound(e, type)
}

</script>

<template>
    <div>
        <p class="text-subtitle-1">Début</p>
        <VTextField
            v-model="currentAvailability.begin"
            type="datetime-local"
            :min="minDate"
            :error-messages="invalidRange"
            :hint="t('pages.profile.availabilities.hint_specific')"
            variant="outlined"
            @blur="toRound($event, 'begin')"
        />

        <VDivider class="border-opacity-100 mb-4" />

        <p class="text-subtitle-1">Fin</p>
        <VTextField
            v-model="currentAvailability.end"
            :min="minDate"
            :hint="t('pages.profile.availabilities.hint_specific')"
            :error-messages="invalidRange"
            type="datetime-local"
            variant="outlined"
            @blur="toRound($event, 'end')"
        />
    </div>
</template>

