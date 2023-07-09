<template>
    <div class="collapse collapse-arrow bg-base-200">
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium">
            Disponibilités
        </div>
        <div class="collapse-content">
            <button class="btn btn-sm btn-info" :class="{ 'btn-outline': weekendEnabled === false }"
                @click.prevent="availableOnWeekEnds(!weekendEnabled)">
                Disponible le week-end
            </button>

            <button class="btn btn-sm btn-info ml-2" :class="{ 'btn-outline': eveningEnabled === false }"
                @click.prevent="availableTheEvenings(!eveningEnabled)">
                Disponible en soirée
            </button>

            <div v-for="(day, i) in (availabilies.days as DayOfWeek[])" class="mb-4" :key="i">
                <h2 class="text-xl mb-2">{{ day }}</h2>

                <div class="grid grid-cols-12 grid-rows-5 gap-2">
                    <input v-for="(hour, i) in availabilies.hours" v-model="formProxy[day]" type="checkbox"
                        class="btn btn-outline btn-xs" :aria-label="hour" :value="hour" :key="i">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { DayOfWeek, User } from 'types'
import availabilies from '@/assets/availabilities.json'

const weekDays: DayOfWeek[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
const eveningHours = [
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30"
];

const props = defineProps<{ modelValue: User['availability'] }>()

const emit = defineEmits<{ (e: 'update:modelValue', value: User['availability']): void }>()

const formProxy = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

const weekendEnabled = computed(() => {
    console.log(toRaw(props.modelValue).Samedi === availabilies.hours)
    return toRaw(props.modelValue).Samedi === availabilies.hours &&
    toRaw(props.modelValue).Dimanche === availabilies.hours
})

const eveningEnabled = computed(() => (true))

/* 
const weekendEnabled = ref(false)
const eveningEnabled = ref(false) */

const availableOnWeekEnds = (enable: boolean) => {
    if (enable) {
        formProxy.value.Samedi = availabilies.hours
        formProxy.value.Dimanche = availabilies.hours
    } else {
        formProxy.value.Samedi = []
        formProxy.value.Dimanche = []
    }
}

const availableTheEvenings = (enable: boolean) => {
    weekDays.forEach((day) => {
        if (enable) {
            formProxy.value[day] = eveningHours
        } else {
            formProxy.value[day] = formProxy.value[day].filter((d) => !eveningHours.includes(d))
        }
    })
}

// Add buttons to automatically fill checkboxes for specific scenarios
// is met manually, the checkbox will be "checked"
// If the condition is partially checked, clicking on it will fill the rest of the condition


</script>

<style scoped lang="scss">
.day {
    @apply flex gap-2 flex-wrap;
}
</style>