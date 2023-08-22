<script setup lang="ts">
import { Form, configure } from 'vee-validate'
import { localize } from '@vee-validate/i18n'
import AvailabilityGenericRow from './AvailabilityGenericRow.vue'
import AvailabilitySpecificRow from './AvailabilitySpecificRow.vue'
import type { GenericDate, SpecificDate } from '@/types'
import useAvailabilities from '@/composables/availabilities'

interface Props {
    form: {
        weekdays: boolean
        weekends: boolean
        available: (GenericDate | SpecificDate)[]
        unavailable: SpecificDate[]
    }
}

const props = defineProps<Props>()

const emit = defineEmits<{ (e: 'input', value: Props['form']): void }>()

const dayjs = useDayjs()
const { calculateOverlap } = useAvailabilities()

const maxHours = 15

configure({
    generateMessage: localize('fr', {
        messages: {
            required: 'Le champ est requis',
            email: 'Format d\'email non valide',
            image: 'Veuillez sélectionner une image',
            max: 'Le fichier ne doit pas faire plus de 2 mo',
            password: 'Le mot de passe doit faire 6 caractères minimum',
            confirm_password: 'Les mots de passe ne correspondent pas',
        },
    }),
})

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
    if (type === 'available') {
        formProxy.value.available.push({
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
    else {
        formProxy.value.unavailable.push({
            begin: '',
            end: '',
            isSpecific: true,
        })
    }
}

const summaryAvailable = computed(() => getSummary(formProxy.value.available, 'available'))

const summaryUnavailable = computed(() => getSummary(formProxy.value.unavailable, 'unavailable'))

const availableOverlapping = computed(() => {
    const grid = calculateOverlap(formProxy.value)
    return grid.includes(2)
})

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

onMounted(() => {
    formProxy.value = props.form
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
        <label
            for="availability"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
            Disponibilités
        </label>

        <div class="flex justify-between">
            <div>
                <p class="mb-4">
                    {{ summary }}
                </p>
                <p
                    v-if="summaryAvailable"
                    class="text-xs"
                >
                    {{ summaryAvailable }}
                </p>

                <p
                    v-if="summaryUnavailable"
                    class="text-xs"
                >
                    {{ summaryUnavailable }}
                </p>
            </div>

            <button
                class="btn btn-info btn-outline btn-sm"
                @click.prevent="openModal = true"
            >
                Modifier
            </button>
        </div>
        <dialog
            class="modal"
            :class="{ 'modal-open': openModal }"
        >
            <Form
                v-slot="{ errors }"
                class="modal-box w-11/12 max-w-5xl"
            >
                <div
                    v-if="availableOverlapping"
                    class="alert alert-error mb-4"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    /></svg>
                    <span>
                        Au moins deux périodes se chevauchent. <br>
                        <template v-if="formProxy.weekdays || formProxy.weekends">
                            Vérifiez qu'une nouvelle période ajoutée n'entre pas en conflit avec vos disponibilités générales.
                        </template>
                    </span>
                </div>
                <h3 class="font-bold text-lg mb-4">
                    Disponibilités générales
                </h3>
                <div class="flex justify-evenly mb-4">
                    <div class="weekdays">
                        <label
                            for="weekday"
                            class="cursor-pointer flex items-center gap-x-4"
                        >
                            <input
                                id="weekday"
                                v-model="formProxy.weekdays"
                                type="checkbox"
                                class="checkbox"
                            >
                            <span class="label-text ml-">Disponible en semaine</span>
                        </label>
                        <label class="label">
                            <span class="label-text-alt ml-9">Du Lundi au Vendredi de 22h à minuit</span>
                        </label>
                    </div>

                    <div class="weekends">
                        <label
                            for="weekend"
                            class="cursor-pointer flex items-center gap-x-4"
                        >
                            <input
                                id="weekend"
                                v-model="formProxy.weekends"
                                type="checkbox"
                                class="checkbox"
                            >
                            <span class="label-text">
                                Disponible en week-end
                            </span>
                        </label>
                        <label class="label">
                            <span class="label-text-alt ml-9">
                                Du samedi au dimanche, toute la journée
                            </span>
                        </label>
                    </div>
                </div>

                <h3 class="font-bold text-lg mb-4">
                    Disponibilités particulières
                </h3>

                <template
                    v-for="(a, i) in formProxy.available"
                    :key="i"
                >
                    <div class="flex gap-4 mb-4">
                        <div class="flex items-center">
                            <div class="form-control">
                                <label class="label cursor-pointer">
                                    <input
                                        v-model="a.isSpecific"
                                        type="checkbox"
                                        aria-label="Date spécifique"
                                        class="btn btn-outline btn-neutral btn-xs"
                                        @input="changeSpecific($event, ['available', i])"
                                    >
                                </label>
                            </div>
                        </div>

                        <AvailabilitySpecificRow
                            v-if="a.isSpecific"
                            :min-date="minDate"
                            :max-hours="maxHours"
                            section="available"
                            :index="i"
                            :fields="a"
                            @remove-date="removeDate('available', i)"
                        />

                        <AvailabilityGenericRow
                            v-else
                            :min-date="minDate"
                            :max-hours="maxHours"
                            section="available"
                            :index="i"
                            :fields="a"
                            @remove-date="removeDate('available', i)"
                        />
                    </div>
                </template>

                <div class="flex justify-end">
                    <button
                        class="btn btn-info btn-outline btn-sm"
                        @click.prevent="addDate('available')"
                    >
                        Ajouter une disponibilité
                    </button>
                </div>

                <h3 class="font-bold text-lg mb-4">
                    Indisponibilité particulières
                </h3>

                <template
                    v-for="(u, i) in formProxy.unavailable"
                    :key="i"
                >
                    <div class="flex gap-4 mb-4">
                        <AvailabilitySpecificRow
                            :min-date="minDate"
                            :max-hours="maxHours"
                            section="unavailable"
                            :index="i"
                            :fields="u"
                            @remove-date="removeDate('unavailable', i)"
                        />
                    </div>
                </template>

                <div class="flex justify-end">
                    <button
                        class="btn btn-warning btn-outline btn-sm"
                        @click.prevent="addDate('unavailable')"
                    >
                        Ajouter une indisponibilité
                    </button>
                </div>

                <div class="modal-action">
                    <button
                        class="btn"
                        :disabled="Object.keys(errors).length > 0 || availableOverlapping"
                        @click.prevent="openModal = false"
                    >
                        Enregistrer
                    </button>
                </div>
            </Form>
        </dialog>
    </div>
</template>
