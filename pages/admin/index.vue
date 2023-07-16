<template>
    <div class="flex justify-end mb-4">
        <RouterLink to="/admin/RP/nouveau" class="btn btn-primary">
            <PlusSmallIcon class="w-4 h-4" />
            Nouveau RP
        </RouterLink>
    </div>
    <div class="overflow-x-auto">
        <table class="table bg-base-200">
            <thead>
                <tr>
                    <th>Titre</th>
                    <th>Description</th>
                    <th class="text-center">Participations</th>
                    <th>Début</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(r, i) in roleplays" :key="i">
                    <td>
                        <div class="flex items-center space-x-3">
                            <div class="avatar">
                                <div class="mask mask-squircle w-12 h-12">
                                    <img :src="r.illustration" alt="illustration du rp" />
                                </div>
                            </div>
                            <div>
                                <div class="font-bold">{{ r.title }}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        {{ truncate(r.description) }}
                    </td>
                    <td class="text-center">
                        {{ r.nbCurrentUsers }} / {{ r.totalUsers }}
                    </td>
                    <td>
                        {{ r.start_date ? dayjs(r.start_date).from(dayjs()) : 'N/A' }}
                    </td>
                    <th class="flex justify-end">
                        <RouterLink :to="`/roleplay/${r.id}`" class="btn btn-ghost">
                            Détails
                        </RouterLink>
                        <RouterLink :to="`/roleplay/${r.id}/modifier`" class="btn btn-ghost">
                            Editer
                        </RouterLink>
                    </th>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { PlusSmallIcon } from '@heroicons/vue/24/solid'
import { useRoleplayStore } from '@/stores/roleplays'

const dayjs = useDayjs()
const roleplayStore = useRoleplayStore()

useHead({
    title: 'Administration'
})

const { rpList: roleplays } = storeToRefs(roleplayStore)
const { loadAllRP } = roleplayStore

onMounted(async() => await loadAllRP())

const truncate = (str: string) => (str.length > 100) ? str.slice(0, 99) + "..." : str

</script>