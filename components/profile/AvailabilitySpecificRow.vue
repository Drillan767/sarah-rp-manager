<script setup lang="ts">
import { defineRule } from 'vee-validate'
import { useDebounceFn } from '@vueuse/core'
import type { SpecificDate } from '@/types'

interface Props {
    minDate: string
    maxHours: number
    index: number
    section: 'available' | 'unavailable'
    fields: SpecificDate
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'remove-date'): void
    (e: 'input', value: any): void
}>()

const dayjs = useDayjs()

const fieldsProxy = computed({
    get: () => props.fields,
    set: (value) => {
        emit('input', value)
    },
})

const debounceRound = useDebounceFn((e: Event, type: 'begin' | 'end') => {
    const target = e.target as HTMLInputElement
    const ms = 1000 * 60 * 30
    const result = new Date(Math.round(new Date(target.value).getTime() / ms) * ms)
    const formattedResult = dayjs(result).format('YYYY-MM-DDTHH:mm')
    fieldsProxy.value[type] = formattedResult
    target.value = formattedResult
}, 1000)

function toRound(e: Event, type: 'begin' | 'end') {
    debounceRound(e, type)
}

defineRule('available', (value: string, [target]: [string]) => {
    const before = dayjs(target)
    const after = dayjs(value)

    if (after.isBefore(before))
        return 'La date de fin ne doit pas être avant la date de début'

    if (after.diff(before, 'm') < 30)
        return 'Veuillez chosir une période d\'au moins 30mn'

    if (dayjs().isAfter(before) || dayjs().isAfter(after))
        return 'La date choisie doit être dans le futur'

    if (props.section === 'available' && after.diff(before, 'h') > props.maxHours)
        return `Veuillez choisir une période de ${props.maxHours}h maximum`

    return true
})
</script>

<template>
    <div class="specific w-full ml-4">
        <div class="grid grid-cols-5 gap-4">
            <div class="col-span-2">
                <label class="label">
                    <span class="label-text">Début</span>
                </label>
                <Field
                    v-model="fieldsProxy.begin"
                    type="datetime-local"
                    :name="`${section}-specific-begin-${index}`"
                    :min="minDate"
                    class="input input-bordered w-full"
                    @blur="toRound($event, 'begin')"
                />
                <label class="label">
                    <span class="label-text-alt">La valeur sera arrondie à la plus proche demi-heure</span>
                </label>
            </div>
            <div class="col-span-2">
                <label class="label">
                    <span class="label-text">Fin</span>
                </label>
                <Field
                    v-model="fieldsProxy.end"
                    type="datetime-local"
                    :name="`${section}-specific-end-${index}`"
                    :min="minDate"
                    class="input input-bordered w-full"
                    :rules="`available:@${section}-specific-begin-${index}`"
                    @blur="toRound($event, 'end')"
                />
                <label class="label">
                    <span class="label-text-alt">La valeur sera arrondie à la plus proche demi-heure</span>
                </label>
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
            :name="`${section}-specific-end-${index}`"
            class="text-red-500"
        />
    </div>
</template>
