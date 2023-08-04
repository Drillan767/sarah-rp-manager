<script setup lang="ts">
import { days, hours } from '@/assets/json/availability-time.json'
import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate'
import { localize } from '@vee-validate/i18n'

interface SpecificDate {
    isSpecific: true
    begin: string
    end: string
}

interface GenericDate {
    isSpecific: false
    begin: {
        day: string
        hour: string
    }
    end: {
        day: string
        hour: string
    }
}

interface Props {
    form: {
        weekdays: boolean
        weekends: boolean
        available: (GenericDate | SpecificDate)[]
        unavailable: (GenericDate | SpecificDate)[]
    }
}

const maxHours = 15

configure({
    generateMessage: localize('fr', {
        messages: {
            required: 'Le champ est requis',
            email: 'Format d\'email non valide',
            image: 'Veuillez sélectionner une image',
            max: 'Le fichier ne doit pas faire plus de 2 mo',
            password: 'Le mot de passe doit faire 6 caractères minimum',
            confirm_password: 'Les mots de passe ne correspondent pas'
        },
    }),
})

defineRule('available', (value: string, [beginDay, beginHour, endDay]: [string, string, string]) => {
    const halfHours = maxHours * 2
    const bdIndex = days.findIndex((d) => d === beginDay)

    console.log(value, beginDay, beginHour, endDay)

    if (beginDay === endDay && beginHour === value) {
        return 'Veuillez sélectionner une période d\'au moins 30mn'
    }

    const { newDay, halfHours: nbHalfHours } = halfHoursBetween(beginHour, value)
    if (newDay && days[bdIndex + 1] !== endDay || nbHalfHours > halfHours) {
        return `Veuillez choisir une période de ${maxHours}h maximum`
    }

    return true
});

defineRule('isAfter', (value: string, [target]: [string]) => {
    const before = dayjs(target)
    const after = dayjs(value)

    if (after.isBefore(before)) {
        return 'La date de fin ne doit pas être avant la date de début'
    }

    if (after.diff(before, 'm') < 30) {
        return 'Veuillez chosir une période d\'au moins 30mn'
    }

    if (dayjs().isBefore(before) || dayjs().isBefore(after)) {
        return 'La date choisie doit être dans le futur'
    }

    if (after.diff(before, 'h') > maxHours) {
        return `Veuillez choisir une période de ${maxHours}h maximum`
    }

    return true
});

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'input', value: Props['form']): void }>()

const dayjs = useDayjs()

const minDate = dayjs().format('YYYY-MM-DDT00:00')

const openModal = ref(false)

const formProxy = computed({
    get: () => props.form,
    set: value => emit('input', value),
})

const summary = computed(() => {
    if (formProxy.value.weekdays && formProxy.value.weekends)
        return 'Disponible les soirs de semaine et le week-end.'

    if (formProxy.value.weekdays)
        return 'Uniquement disponible en semaine'
    if (formProxy.value.weekends)
        return 'Uniquement disponible les week-ends'

    return 'Indisponible en semaine ni en week-end'
})

function addDate(type: 'available' | 'unavailable') {
    formProxy.value[type].push({
        begin: {
            day: 'Lundi',
            hour: '00:00',
        },
        end: {
            day: 'Lundi',
            hour: '00:00',
        },
        isSpecific: false,
    })
}

const summaryAvailable = computed(() => getSummary(formProxy.value.available, 'available'))

const summaryUnavailable = computed(() => getSummary(formProxy.value.unavailable, 'unavailable'))

function getSummary(data: (GenericDate | SpecificDate)[], type: 'available' | 'unavailable') {
    if (formProxy.value.available.length === 0)
        return null
    let response = type === 'available' ? 'Disponible ' : 'Indisponible '
    if (data.length === 1) {
        return response += retrieveDate(formProxy.value[type][0])
    }
    else {
        formProxy.value[type].forEach((a, i) => {
            response += retrieveDate(a)
            if (i + 2 === formProxy.value[type].length)
                response += ' et '

            else if (i + 1 !== formProxy.value[type].length)
                response += ', '
        })

        return response
    }
}

function retrieveDate(a: GenericDate | SpecificDate) {
    const fragment = 'du X au Y'
    let from = ''
    let to = ''
    if (a.isSpecific) {
        from = dayjs(a.begin).format('DD/MM/YYYY HH:mm')
        to = dayjs(a.end).format('DD/MM/YYYY HH:mm')
    }
    else {
        const { day: beginDay, hour: beginHour } = a.begin
        const { day: endDay, hour: endHour } = a.end
        from = `${beginDay} à ${beginHour}`
        to = `${endDay} à ${endHour}`
    }
    return `${fragment.replace('X', from).replace('Y', to)}`
}

function removeDate(type: 'available' | 'unavailable', index: number) {
    formProxy.value[type].splice(index, 1)
}

function timeToMinutes(timeStr: typeof hours[number]) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function halfHoursBetween(beginTimeStr: typeof hours[number], endTimeStr: typeof hours[number]) {
    const beginMinutes = timeToMinutes(beginTimeStr);
    const endMinutes = timeToMinutes(endTimeStr);
    let newDay = false
    let nextDayOffset = 0

    // Check if the endTime is before the beginTime (spans across two days)
    if (endMinutes < beginMinutes) {
        nextDayOffset = 24 * 60
        newDay = true
    }

    // Assuming both times are within the same 24-hour period
    const timeDifference = endMinutes + nextDayOffset - beginMinutes;

    // Calculate the number of half hours
    const halfHours = Math.floor(timeDifference / 30);

    return { newDay, halfHours }
}

onMounted(() => {
    formProxy.value = props.form

    addEventListener('keydown', (e) => {
        if (e.key === 'Escape')
            openModal.value = false
    })
})

function changeSpecific(e: any, params: ['available' | 'unavailable', number]) {
    const [type, index] = params
    if (e.target.checked === false) {
        formProxy.value[type][index] = {
            isSpecific: false,
            begin: {
                day: 'Lundi',
                hour: '00:00',
            },
            end: {
                day: 'Lundi',
                hour: '00:00',
            },
        }
    }
}
</script>

<template>
    <div class="sm:col-span-2">
        <label for="availability" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Disponibilités
        </label>

        <div class="flex justify-between">
            <div>
                <p class="mb-4">
                    {{ summary }}
                </p>
                <p v-if="summaryAvailable" class="text-xs">
                    {{ summaryAvailable }}
                </p>

                <p v-if="summaryUnavailable" class="text-xs">
                    {{ summaryUnavailable }}
                </p>
            </div>

            <button class="btn btn-info btn-outline btn-sm" @click.prevent="openModal = true">
                Modifier
            </button>
        </div>
        <dialog class="modal" :class="{ 'modal-open': openModal }">
            <Form v-slot="{ errors }" class="modal-box w-11/12 max-w-5xl">
                <h3 class="font-bold text-lg mb-4">
                    Disponibilités générales
                </h3>
                <div class="flex justify-evenly mb-4">
                    <div class="weekdays">
                        <label for="weekday" class="cursor-pointer flex items-center gap-x-4">
                            <input id="weekday" v-model="formProxy.weekdays" type="checkbox" class="checkbox">
                            <span class="label-text ml-">Disponible en semaine</span>
                        </label>
                        <label class="label">
                            <span class="label-text-alt ml-9">Du Lundi au Vendredi aux environs de 22h</span>
                        </label>
                    </div>

                    <div class="weekends">
                        <label for="weekend" class="cursor-pointer flex items-center gap-x-4">
                            <input id="weekend" v-model="formProxy.weekends" type="checkbox" class="checkbox">
                            <span class="label-text">
                                Disponible en week-end
                            </span>
                        </label>
                        <label class="label">
                            <span class="label-text-alt ml-9">
                                Du samedi au dimanche à n'importe quelle heure
                            </span>
                        </label>
                    </div>
                </div>

                <h3 class="font-bold text-lg mb-4">
                    Disponibilités particulières
                </h3>

                <template v-for="(a, i) in formProxy.available">
                    <div class="grid grid-cols-6 grid-rows-1 gap-4 mb-4">
                        <div class="flex items-end">
                            <div class="form-control">
                                <label class="label cursor-pointer">
                                    <input v-model="a.isSpecific" type="checkbox" aria-label="Date spécifique"
                                        class="btn btn-outline btn-neutral btn-xs"
                                        @input="changeSpecific($event, ['available', i])">
                                </label>
                            </div>
                        </div>

                        <div class="col-span-2">
                            <div class="form-control w-full max-w-xs">
                                <label class="label">
                                    <span class="label-text">Début</span>
                                </label>
                                <div class="flex gap-x-2">
                                    <template v-if="a.isSpecific">
                                        <Field v-model="a.begin" type="datetime-local" :name="`begin-available-specific-${i}`"
                                            :min="minDate" class="input input-bordered w-full max-w-xs" />
                                    </template>
                                    <template v-else>
                                        <Field :name="`begin-available-generic-day-${i}`" v-model="a.begin.day"
                                            class="select select-bordered w-1/2 max-w-xs" as="select">
                                            <option v-for="(day, j) in days" :key="j" :value="day" :selected="j === 0">
                                                {{ day }}
                                            </option>
                                        </Field>
                                        <Field :name="`begin-available-generic-hour-${i}`" v-model="a.begin.hour"
                                            class="select select-bordered w-1/2 max-w-xs" as="select">
                                            <option v-for="(hour, j) in hours" :key="j" :value="hour" :selected="j === 0">
                                                {{ hour }}
                                            </option>
                                        </Field>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="col-span-2 col-start-4">
                            <div class="form-control w-full max-w-xs">
                                <label class="label">
                                    <span class="label-text">Fin</span>
                                </label>
                                <div class="flex gap-x-2">
                                    <template v-if="a.isSpecific">
                                        <Field v-model="a.end" type="datetime-local" :name="`end-available-specific-${i}`"
                                            :min="minDate" class="input input-bordered w-full max-w-xs"
                                            :rules="`isAfter:@begin-available-specific-${i}`" />
                                    </template>
                                    <template v-else>
                                        <Field :name="`end-available-generic-day-${i}`" v-model="a.end.day"
                                            class="select select-bordered w-1/2 max-w-xs" as="select">
                                            <option v-for="(day, j) in days" :key="j" :value="day" :selected="j === 0">
                                                {{ day }}
                                            </option>
                                        </Field>
                                        <Field :name="`end-available-generic-hour-${i}`" v-model="a.end.hour"
                                            class="select select-bordered w-1/2 max-w-xs" as="select"
                                            :rules="`available:@begin-available-generic-day-${i},@begin-available-generic-hour-${i},@end-available-generic-day-${i}`">
                                            <option v-for="(hour, j) in hours" :key="j" :value="hour" :selected="j === 0">
                                                {{ hour }}
                                            </option>
                                        </Field>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="col-start-6 flex items-end justify-end">
                            <button class="btn btn-outline btn-error btn-md" @click.prevent="removeDate('available', i)">
                                Retirer
                            </button>
                        </div>
                    </div>
                    <ErrorMessage v-if="a.isSpecific" class="text-red-500" :name="`end-available-specific-${i}`" />
                    <ErrorMessage v-else class="text-red-500" :name="`end-available-generic-hour-${i}`" />
                </template>

                <div class="flex justify-end">
                    <button class="btn btn-info btn-outline btn-sm" @click.prevent="addDate('available')">
                        Ajouter une disponibilité
                    </button>
                </div>

                <h3 class="font-bold text-lg mb-4">
                    Indisponibilité particulières
                </h3>

                <template v-for="(u, i) in formProxy.unavailable">
                    <div class="grid grid-cols-6 grid-rows-1 gap-4 mb-4">
                        <div class="flex items-end">
                            <div class="form-control">
                                <label class="label cursor-pointer">
                                    <input v-model="u.isSpecific" class="btn btn-outline btn-neutral btn-xs" type="checkbox"
                                        aria-label="Date spécifique" @input="changeSpecific($event, ['unavailable', i])">
                                </label>
                            </div>
                        </div>

                        <div class="col-span-2">
                            <div class="form-control w-full max-w-xs">
                                <label class="label">
                                    <span class="label-text">Début</span>
                                </label>
                                <div class="flex gap-x-2">
                                    <template v-if="u.isSpecific">
                                        <Field v-model="u.begin" type="datetime-local" :name="`begin-unavailable-specific-${i}`"
                                            :min="minDate" class="input input-bordered w-full max-w-xs" />
                                    </template>
                                    <template v-else>
                                        <Field :name="`begin-unavailable-generic-day-${i}`" v-model="u.begin.day"
                                            class="select select-bordered w-1/2 max-w-xs" as="select">
                                            <option v-for="(day, j) in days" :key="j" :value="day" :selected="j === 0">
                                                {{ day }}
                                            </option>
                                        </Field>
                                        <Field :name="`begin-unavailable-generic-hour-${i}`" v-model="u.begin.hour"
                                            class="select select-bordered w-1/2 max-w-xs" as="select">
                                            <option v-for="(hour, j) in hours" :key="j" :value="hour" :selected="j === 0">
                                                {{ hour }}
                                            </option>
                                        </Field>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="col-span-2 col-start-4">
                            <div class="form-control w-full max-w-xs">
                                <label class="label">
                                    <span class="label-text">Fin</span>
                                </label>
                                <div class="flex gap-x-2">
                                    <template v-if="u.isSpecific">
                                        <Field v-model="u.end" type="datetime-local" :name="`end-unavailable-specific-${i}`"
                                            :min="minDate" class="input input-bordered w-full max-w-xs"
                                            :rules="`isAfter:@begin-unavailable-specific-${i}`" />
                                    </template>
                                    <template v-else>
                                        <Field :name="`end-unavailable-generic-day-${i}`" v-model="u.end.day"
                                            class="select select-bordered w-1/2 max-w-xs" as="select">
                                            <option v-for="(day, j) in days" :key="j" :value="day" :selected="j === 0">
                                                {{ day }}
                                            </option>
                                        </Field>
                                        <Field :name="`end-unavailable-generic-hour-${i}`" v-model="u.end.hour"
                                            class="select select-bordered w-1/2 max-w-xs" as="select"
                                            :rules="`available:@begin-unavailable-generic-day-${i},@begin-unavailable-generic-hour-${i},@end-unavailable-generic-day-${i}`">

                                            <option v-for="(hour, j) in hours" :key="j" :value="hour" :selected="j === 0">
                                                {{ hour }}
                                            </option>
                                        </Field>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="col-start-6 flex items-end justify-end">
                            <button class="btn btn-outline btn-error btn-md" @click.prevent="removeDate('unavailable', i)">
                                Retirer
                            </button>
                        </div>
                    </div>
                    <ErrorMessage v-if="u.isSpecific" class="text-red-500" :name="`end-unavailable-specific-${i}`" />
                    <ErrorMessage v-else class="text-red-500" :name="`end-unavailable-generic-hour-${i}`" />
                </template>

                <div class="flex justify-end">
                    <button class="btn btn-warning btn-outline btn-sm" @click.prevent="addDate('unavailable')">
                        Ajouter une indisponibilité
                    </button>
                </div>

                <div class="modal-action">
                    <button class="btn" @click.prevent="openModal = false" :disabled="Object.keys(errors).length > 0">
                        Enregistrer
                    </button>
                </div>
            </Form>
        </dialog>
    </div>
</template>