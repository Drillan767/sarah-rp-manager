<script setup lang="ts">
import type { GenericDate } from '@/types'
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

const invalidRange = computed(() => {
    const halfHours = props.maxHours * 2

    /* const beginDay = fieldsProxy.value.begin.day
    const beginHour = fieldsProxy.value.begin.hour
    const endDay = fieldsProxy.value.end.day
    const endHour = fieldsProxy.value.end.hour */

    const {
        begin: { day: beginDay, hour: beginHour },
        end: { day: endDay, hour: endHour },
    } = fieldsProxy.value

    const bdIndex = days.findIndex(d => d === beginDay)

    const { newDay, halfHours: nbHalfHours } = halfHoursBetween(beginHour, endHour)

    const sameDates = `${beginDay} ${beginHour}` === `${endDay} ${endHour}`

    // Returns true if both beginDay and endDay are different while newDay is false.
    const differentDays = newDay === false && beginDay !== endDay

    // Returns true if newDay is true, but beginDay and endDay are not following each other.
    const daysNotFollowing = newDay && (
        bdIndex !== days.length - 1
            ? days[bdIndex + 1] !== endDay
            : endDay !== days[0]
    )

    // Returns true if nbHalfHours exceeds max halfHours.
    const tooMuchHours = nbHalfHours > halfHours

    if ([sameDates, differentDays, daysNotFollowing, tooMuchHours].includes(true))
        return `Veuillez choisir une période de ${props.maxHours}h maximum`

    return false
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
                    <select
                        v-model="fieldsProxy.begin.day"
                        class="select select-bordered w-1/2 max-w-xs"
                    >
                        <option
                            v-for="(day, j) in days"
                            :key="j"
                            :value="day"
                            :selected="j === 0"
                        >
                            {{ day }}
                        </option>
                    </select>

                    <select
                        v-model="fieldsProxy.begin.hour"
                        class="select select-bordered w-1/2 max-w-xs"
                    >
                        <option
                            v-for="(hour, j) in hours"
                            :key="j"
                            :value="hour"
                            :selected="j === 0"
                        >
                            {{ hour }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="col-span-2 col-start-3">
                <label class="label">
                    <span class="label-text">Fin</span>
                </label>
                <div class="flex gap-x-2">
                    <select
                        v-model="fieldsProxy.end.day"
                        class="select select-bordered w-1/2 max-w-xs"
                    >
                        <option
                            v-for="(day, j) in days"
                            :key="j"
                            :value="day"
                            :selected="j === 0"
                        >
                            {{ day }}
                        </option>
                    </select>

                    <select
                        v-model="fieldsProxy.end.hour"
                        class="select select-bordered w-1/2 max-w-xs"
                    >
                        <option
                            v-for="(hour, j) in hours"
                            :key="j"
                            :value="hour"
                            :selected="j === 0"
                        >
                            {{ hour }}
                        </option>
                    </select>
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

        <span
            v-if="invalidRange"
            class="text-red-500"
        >
            {{ invalidRange }}
        </span>
    </div>
</template>
