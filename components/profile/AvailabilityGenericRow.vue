<script setup lang="ts">
import { defineRule } from 'vee-validate'
import type { GenericDate } from 'types'
import { days, hours } from '@/assets/json/availability-time.json'

interface Props {
    minDate: string
    maxHours: number
    index: number
    section: 'available' | 'unavailable'
    fields: GenericDate
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'remove-date'): void
    (e: 'input', value: Props['fields']): void
}>()

const fieldsProxy = computed({
    get: () => props.fields,
    set: value => emit('input', value),
})

function timeToMinutes(timeStr: typeof hours[number]) {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
}

function halfHoursBetween(beginTimeStr: typeof hours[number], endTimeStr: typeof hours[number]) {
    const beginMinutes = timeToMinutes(beginTimeStr)
    const endMinutes = timeToMinutes(endTimeStr)
    let newDay = false
    let nextDayOffset = 0

    // Check if the endTime is before the beginTime (spans across two days)
    if (endMinutes < beginMinutes) {
        nextDayOffset = 24 * 60
        newDay = true
    }

    // Assuming both times are within the same 24-hour period
    const timeDifference = endMinutes + nextDayOffset - beginMinutes

    // Calculate the number of half hours
    const halfHours = Math.floor(timeDifference / 30)

    return { newDay, halfHours }
}

defineRule('available', (value: string, [beginDay, beginHour, endDay]: [string, string, string]) => {
    const halfHours = props.maxHours * 2
    const bdIndex = days.findIndex(d => d === beginDay)

    const { newDay, halfHours: nbHalfHours } = halfHoursBetween(beginHour, value)

    // Returns true if both beginDay and endDay are different while newDay is false.
    const differentDays = newDay === false && beginDay !== endDay

    // Returns true if newDay is true, but beginDay and endDay are not following each other.
    const daysNotFollowing = newDay && days[bdIndex + 1] !== endDay

    // Returns true if nbHalfHours exceeds max halfHours.
    const tooMuchHours = nbHalfHours > halfHours

    if (beginDay === endDay && beginHour === value)
        return 'Veuillez sélectionner une période d\'au moins 30mn'

    const rules = [
        differentDays,
        daysNotFollowing,
        tooMuchHours,
    ]

    if (rules.includes(true))
        return `Veuillez choisir une période de ${props.maxHours}h maximum`

    return true
})
</script>

<template>
    <div class="generic w-full ml-4">
        <div class="grid grid-cols-5 gap-4">
            <div class="col-span-2">
                <label class="label">
                    <span class="label-text">Début</span>
                </label>
                <div class="flex gap-x-2">
                    <Field
                        v-model="fieldsProxy.begin.day"
                        :name="`${section}-begin-generic-day-${index}`"
                        class="select select-bordered w-1/2 max-w-xs"
                        as="select"
                    >
                        <option
                            v-for="(day, j) in days"
                            :key="j"
                            :value="day"
                            :selected="j === 0"
                        >
                            {{ day }}
                        </option>
                    </Field>
                    <Field
                        v-model="fieldsProxy.begin.hour"
                        :name="`${section}-begin-generic-hour-${index}`"
                        class="select select-bordered w-1/2 max-w-xs"
                        as="select"
                    >
                        <option
                            v-for="(hour, j) in hours"
                            :key="j"
                            :value="hour"
                            :selected="j === 0"
                        >
                            {{ hour }}
                        </option>
                    </Field>
                </div>
            </div>

            <div class="col-span-2 col-start-3">
                <label class="label">
                    <span class="label-text">Fin</span>
                </label>
                <div class="flex gap-x-2">
                    <Field
                        v-model="fieldsProxy.end.day"
                        :name="`${section}-end-generic-day-${index}`"
                        class="select select-bordered w-1/2 max-w-xs"
                        as="select"
                    >
                        <option
                            v-for="(day, j) in days"
                            :key="j"
                            :value="day"
                            :selected="j === 0"
                        >
                            {{ day }}
                        </option>
                    </Field>
                    <Field
                        v-model="fieldsProxy.end.hour"
                        :name="`${section}-end-generic-hour-${index}`"
                        class="select select-bordered w-1/2 max-w-xs"
                        as="select"
                        :rules="`available:@${section}-begin-generic-day-${index},@${section}-begin-generic-hour-${index},@${section}-end-generic-day-${index}`"
                    >
                        <option
                            v-for="(hour, j) in hours"
                            :key="j"
                            :value="hour"
                            :selected="j === 0"
                        >
                            {{ hour }}
                        </option>
                    </Field>
                </div>
            </div>

            <div class="col-start-5 flex items-center justify-end">
                <button
                    class="btn btn-outline btn-error btn-md"
                    @click.prevent="emit('remove-date')"
                >
                    Retirer
                </button>
            </div>
        </div>

        <ErrorMessage
            class="text-red-500"
            :name="`${section}-end-generic-hour-${index}`"
        />
    </div>
</template>
