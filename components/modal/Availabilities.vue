<template>
    <div class="collapse collapse-arrow bg-base-200">
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium">
            Disponibilités
        </div>
        <div class="collapse-content">
            <div v-for="(day, i) in (availabilies.days as DayOfWeek[])" class="mb-4" :key="i">
                <h2 class="text-xl">{{ day }}</h2>

                <div class="grid grid-cols-12 grid-rows-5 gap-2">
                    <input
                        v-for="(hour, i) in availabilies.hours"
                        v-model="selectedTimes[day]"
                        type="checkbox"
                        class="btn btn-outline btn-xs"
                        :aria-label="hour"
                        :value="hour"
                        :key="i"
                    >
                </div>
            </div>
            <!-- <div v-for="(hours, day) in []" class="mb-4" :key="day">
                <h2>{{ day }}</h2>
                <div class="grid grid-cols-12 grid-rows-5 gap-2">
                    <input
                    v-for="(hour, i) in hours"
                    v-model="selectedTimes"
                    type="checkbox"
                    class="btn btn-outline btn-xs"
                    :aria-label="hour"
                    :value="hour"
                    :key="i"
                />
                </div>
            </div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import availabilies from '@/assets/availabilities.json'

type DayOfWeek = "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi" | "Samedi" | "Dimanche";

type SelectedDates = {
    Lundi: string[],
    Mardi: string[],
    Mercredi: string[],
    Jeudi: string[],
    Vendredi: string[],
    Samedi: string[],
    Dimanche: string[],
}

// Add buttons to automatically fill checkboxes for specific scenarios
// such as "completely free on the week end"
// Or "Available after work"
// The buttons will also be a checkbox refering a boolean, if the condition
// is met manually, the checkbox will be "checked"
// If the condition is partially checked, clicking on it will fill the rest of the condition


const selectedTimes = ref<SelectedDates>({
    Lundi: [],
    Mardi: [],
    Mercredi: [],
    Jeudi: [],
    Vendredi: [],
    Samedi: [],
    Dimanche: [],
})

</script>

<style scoped lang="scss">
.day {
    @apply flex gap-2 flex-wrap;
}
</style>