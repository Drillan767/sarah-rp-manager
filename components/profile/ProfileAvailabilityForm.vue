<script setup lang="ts">
import type { Availability, GenericDate, SpecificDate } from '~/types/models'
import type { Database } from '~/types/supabase'
import useSnackBar from '~/composables/snackbar'
import useAvailabilities from '~/composables/availabilities'

interface AvailableDate {
    type: 'available'
    content: SpecificDate | GenericDate
}

interface UnavailableDate {
    type: 'unavailable'
    content: SpecificDate
}

type Payload = AvailableDate | UnavailableDate

const { t } = useI18n()
const dayjs = useDayjs()
const supabase = useSupabaseClient<Database>()
const session = useSupabaseUser()
const { calculateOverlap } = useAvailabilities()
const { showSuccess } = useSnackBar()

const availabilities = ref<Availability>({
    weekdays: false,
    weekends: false,
    available: [],
    unavailable: [],
})

const loading = ref(false)
const itemGroup = ref<number[]>([])
const displayAvailabilityModale = ref(false)
const currentAvailability = ref<SpecificDate | GenericDate>()
const currentIndex = ref<number>()
const availabilityType = ref<'available' | 'unavailable'>('available')
const modalType = ref<'create' | 'update'>('create')

const periodOverlapping = computed(() => {
    const grid = calculateOverlap(availabilities.value)
    return grid.includes(2)
})

onMounted(async () => {
    loading.value = true
    const { data } = await supabase
        .from('users')
        .select('availability')
        .eq('session_id', session.value!.id)
        .single()

    if (data) {
        availabilities.value = data.availability as unknown as Availability
        if (availabilities.value.weekdays)
            itemGroup.value.push(0)
        if (availabilities.value.weekends)
            itemGroup.value.push(1)
    }

    loading.value = false
})

watch(itemGroup, (value) => {
    availabilities.value.weekdays = 0 in value
    availabilities.value.weekends = 1 in value
})

function addDate(type: 'available' | 'unavailable') {
    availabilityType.value = type
    modalType.value = 'create'
    displayAvailabilityModale.value = true
}

function editDate(date: GenericDate | SpecificDate, type: 'available' | 'unavailable', index: number) {
    currentAvailability.value = date
    availabilityType.value = type
    currentIndex.value = index
    modalType.value = 'update'

    displayAvailabilityModale.value = true
}

function removeDate(type: 'available' | 'unavailable', i: number) {
    availabilities.value[type].splice(i, 1)
}

function addAvailabilty(value: Payload) {
    const { type, content } = value
    if (type === 'available')
        availabilities.value.available.push(content)
    if (type === 'unavailable')
        availabilities.value[type].push(content)
}

function updateAvailability(value: { date: Payload, i: number }) {
    const { date: { type, content }, i } = value

    availabilities.value[type][i] = content
}

async function submit() {
    loading.value = true

    await supabase
        .from('users')
        .update({ availability: availabilities.value })
        .eq('session_id', session.value!.id)

    loading.value = false

    showSuccess(t('pages.profile.success.availabilities'))
}

function closeModal() {
    currentIndex.value = undefined
    currentAvailability.value = undefined
    displayAvailabilityModale.value = false
}

function generateSummary(type: 'available' | 'unavailable', availability: GenericDate | SpecificDate) {
    const typeKey = type === 'available' ? 'pages.profile.availabilities.state' : 'pages.profile.availabilities.negative'
    if (availability.isSpecific) {
        const begin = dayjs(availability.begin).format('DD/MM/YYYY HH:mm')
        const end = dayjs(availability.end).format('DD/MM/YYYY HH:mm')
        return `${t(typeKey)} ${t('pages.profile.availabilities.sumup_specific', { begin, end })}`
    }
    else {
        const beginDay = t(`weekdays.${availability.begin.day}`)
        const endDay = t(`weekdays.${availability.end.day}`)
        const { begin: { hour: beginHour }, end: { hour: endHour } } = availability

        return `${t(typeKey)} ${t('pages.profile.availabilities.sumup_generic', { beginDay, beginHour, endDay, endHour })}`
    }
}
</script>

<template>
    <VCard
        prepend-icon="mdi-calendar-clock"
        :loading="loading"
        class="mb-4"
    >
        <template #title>
            {{ t('pages.profile.availabilities.title') }}
        </template>
        <VForm @submit.prevent="submit">
            <VContainer>
                <VAlert
                    v-if="periodOverlapping"
                    color="red"
                    type="error"
                >
                    <template #text>
                        <p>{{ t('pages.profile.error.overlap') }}</p>
                        <p v-if="availabilities.weekdays">
                            {{ t('pages.profile.error.general') }}
                        </p>
                    </template>
                </VAlert>
                <VRow>
                    <VCol>
                        <VItemGroup
                            v-model="itemGroup"
                            selected-class="bg-blue"
                            :multiple="true"
                        >
                            <VContainer>
                                <VRow>
                                    <VCol class="d-flex justify-lg-center">
                                        <VItem
                                            v-slot="{ isSelected, toggle }"
                                        >
                                            <VCard
                                                color="blue"
                                                :variant="isSelected ? 'elevated' : 'outlined'"
                                                class="d-flex align-center text-center"
                                                dark
                                                width="400"
                                                height="100"
                                                @click="toggle"
                                            >
                                                <div class="text-center w-full">
                                                    <span class="v-card-title">
                                                        {{ t('pages.profile.availabilities.weekday_label') }}
                                                    </span>
                                                    <span class="v-card-subtitle">
                                                        {{ t('pages.profile.availabilities.weekday_hint') }}
                                                    </span>
                                                </div>
                                            </VCard>
                                        </VItem>
                                    </VCol>
                                    <VCol class="d-flex justify-lg-center">
                                        <VItem
                                            v-slot="{ isSelected, toggle }"
                                        >
                                            <VCard
                                                color="blue"
                                                :variant="isSelected ? 'elevated' : 'outlined'"
                                                class="d-flex align-center"
                                                dark
                                                width="400"
                                                height="100"
                                                @click="toggle"
                                            >
                                                <div class="text-center w-full">
                                                    <span class="v-card-title">
                                                        {{ t('pages.profile.availabilities.weekend_label') }}
                                                    </span>
                                                    <span class="v-card-subtitle">
                                                        {{ t('pages.profile.availabilities.weekend_hint') }}
                                                    </span>
                                                </div>
                                            </VCard>
                                        </VItem>
                                    </VCol>
                                </VRow>
                            </VContainer>
                        </VItemGroup>
                    </VCol>
                </VRow>
                <VRow>
                    <VCol>
                        <VDivider class="border-opacity-100 mb-4" />
                    </VCol>
                </VRow>
                <VRow>
                    <VCol>
                        <VCard
                            v-for="(a, i) in availabilities.available"
                            :key="i"
                            class="mb-4"
                            variant="tonal"
                            color="blue"
                        >
                            <VCardItem>
                                <VRow>
                                    <VCol
                                        class="d-flex align-center"
                                        cols="8"
                                    >
                                        {{ generateSummary('available', a) }}
                                    </VCol>
                                    <VCol
                                        class="d-flex gap-2 justify-end items-center"
                                        cols="4"
                                    >
                                        <VBtn
                                            icon="mdi-calendar-edit"
                                            color="warning"
                                            variant="flat"
                                            @click="editDate(a, 'available', i)"
                                        />
                                        <VBtn
                                            icon="mdi-trash-can-outline"
                                            color="error"
                                            variant="flat"
                                            @click="removeDate('available', i)"
                                        />
                                    </VCol>
                                </VRow>
                            </VCardItem>
                        </VCard>
                    </VCol>
                </VRow>

                <div class="d-flex justify-center">
                    <VBtn
                        color="blue"
                        variant="outlined"
                        rounded="xl"
                        prepend-icon="mdi-plus-circle-outline"
                        class="mt-4"
                        @click="addDate('available')"
                    >
                        {{ t('pages.profile.availabilities.add') }} {{ t('pages.profile.availabilities.self') }}
                    </VBtn>
                </div>

                <VRow>
                    <VCol>
                        <VDivider class="border-opacity-100 my-4" />
                    </VCol>
                </VRow>

                <VRow>
                    <VCol>
                        <VCard
                            v-for="(u, i) in availabilities.unavailable"
                            :key="i"
                            class="mb-4"
                            variant="tonal"
                            color="red"
                        >
                            <VCardItem>
                                <VRow>
                                    <VCol
                                        class="d-flex align-center"
                                        cols="8"
                                    >
                                        {{ generateSummary('unavailable', u) }}
                                    </VCol>
                                    <VCol
                                        class="d-flex gap-2 justify-end items-center"
                                        cols="4"
                                    >
                                        <VBtn
                                            icon="mdi-calendar-edit"
                                            color="warning"
                                            variant="flat"
                                            @click="editDate(u, 'unavailable', i)"
                                        />
                                        <VBtn
                                            icon="mdi-trash-can-outline"
                                            color="error"
                                            variant="flat"
                                            @click="removeDate('unavailable', i)"
                                        />
                                    </VCol>
                                </VRow>
                            </VCardItem>
                        </VCard>
                    </VCol>
                </VRow>

                <div class="d-flex justify-center">
                    <VBtn
                        color="orange"
                        variant="outlined"
                        rounded="xl"
                        prepend-icon="mdi-minus-circle-outline"
                        class="mt-4"
                        @click="addDate('unavailable')"
                    >
                        {{ t('pages.profile.availabilities.add') }} {{ t('pages.profile.availabilities.unself') }}
                    </VBtn>
                </div>
            </VContainer>
            <VCardActions class="d-flex justify-end">
                <VBtn
                    color="primary"
                    type="submit"
                    :disabled="periodOverlapping || loading"
                >
                    {{ t('form.save') }}
                </VBtn>
            </VCardActions>
        </VForm>
        <ProfileAvailabilityModale
            :show="displayAvailabilityModale"
            :modal-type="modalType"
            :availability-type="availabilityType"
            :current-availability="currentAvailability"
            :current-index="currentIndex"
            @close="closeModal"
            @save="addAvailabilty"
            @update="updateAvailability"
        />
    </VCard>
</template>
