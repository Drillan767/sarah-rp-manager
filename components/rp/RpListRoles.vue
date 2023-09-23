<script lang="ts" setup>
import { TrashIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'
defineProps<{ roles: any[] }>()
</script>

<template>
    <div>
        <!-- <ul>
            <li
                v-for="(role, i) in roles"
                :key="i"
            >
                {{ role }}
            </li>
        </ul> -->
        <div
            v-for="(role, i) in roles"
            :key="i"
            class="grid grid-cols-4 grid-rows-3 gap-4"
        >
            <div class="col-span-2">{{ role.name }}</div>
            <div class="col-start-3">{{ role.max_users }}</div>
            <div class="col-start-4 flex justify-end">
                <button
                    class="btn btn-square btn-warning"
                >
                    <PencilSquareIcon class="w-5 h-5" />

                </button>
                <button
                    class="btn btn-square btn-error ml-1"
                >
                    <TrashIcon class="w-5 h-5" />

                </button>
            </div>
            <div class="col-span-4 row-span-2 row-start-2">
                {{ role.description }}
            </div>
        </div>
    </div>
</template>
