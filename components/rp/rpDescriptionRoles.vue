<script setup lang="ts">
import AddEditRoleModal from './addEditRoleModal.vue'
import { useRoleplayStore } from '@/stores/roleplays'

interface Role {
    id: number
    name: string
    max_users: number
    roleplay_id: string
}

interface Props {
    description?: string
    editable: boolean
    roles?: Role[]
}

const props = withDefaults(defineProps<Props>(), {
    roles: () => ([]),
})
const route = useRoute()
const rpStore = useRoleplayStore()
const { loadSingleRP } = rpStore
const { params: { id } } = route

const FormBase: Omit<Role, 'id'> = {
    roleplay_id: id.toString(),
    name: '',
    max_users: 1,
}

const currentRole = ref<typeof FormBase>({
    roleplay_id: id.toString(),
    name: '',
    max_users: 1,
})

const showAddEditModal = ref(false)
const creating = ref(true)

const readableDescription = computed(() => {
    if (props.description)
        return props.description.replace(/(?:\r\n|\r|\n)/g, '<br>')
    return ''
})

function editRole(selectedRole: Omit<Role, 'roleplay_id'>) {
    if (!props.editable)
        return
    creating.value = false
    currentRole.value = { ...selectedRole, roleplay_id: id.toString() }
    showAddEditModal.value = true
}

function createRole() {
    if (!props.editable)
        return
    creating.value = true
    currentRole.value = Object.assign({}, FormBase)
    showAddEditModal.value = true
}

function success() {
    showAddEditModal.value = false
    currentRole.value = Object.assign({}, FormBase)
    loadSingleRP(id.toString())
}

function close() {
    currentRole.value = Object.assign({}, FormBase)
    showAddEditModal.value = false
}
</script>

<template>
    <div class="description-roles">
        <div class="description mb-4">
            <ClientOnly>
                <p v-html="readableDescription" />
            </ClientOnly>
        </div>
        <div class="roles">
            <div class="flex justify-between">
                <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                    Rôles disponibles
                </h2>
                <button
                    v-if="editable"
                    class="btn btn-primary"
                    @click="createRole"
                >
                    Nouveau rôle
                </button>
            </div>

            <div class="list">
                <div
                    v-for="(role, i) in roles"
                    :key="i"
                    class="join mr-2"
                >
                    <button
                        class="btn join-item btn-outline btn-primary"
                        @click="editRole(role)"
                    >
                        {{ role.name }}
                    </button>
                    <!-- TODO: display actual members -->
                    <button class="btn join-item btn-outline btn-primary">
                        0 / {{ role.max_users }}
                    </button>
                </div>
            </div>
        </div>
        <AddEditRoleModal
            :show="showAddEditModal"
            :role="currentRole"
            :creating="creating"
            @close="close"
            @success="success"
        />
    </div>
</template>
