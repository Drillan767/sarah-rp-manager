<script lang="ts" setup>
import { TrashIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'

type Role = {
    id?: number
    name: string
    max_users: number,
    description: string,
}

defineProps<{ roles: any[] }>()

const showRoleEditModal = ref(false)
const showRoleDeleteModal = ref(false)

const selectedRole = ref<Role>({} as Role)
</script>

<template>
    <div>
        <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Rôles</h2>
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
