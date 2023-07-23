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
                <button v-if="editable" @click="createRole" class="btn btn-primary">
                    Nouveau rôle
                </button>
            </div>

            <div class="list">
                <div class="join mr-2" v-for="(role, i) in roles" :key="i">
                    <button @click="editRole(role)" class="btn join-item btn-outline btn-primary">{{ role.name }}</button>
                    <!-- TODO: display actual members -->
                    <button class="btn join-item btn-outline btn-primary">0 / {{ role.max_users }}</button>
                </div>
            </div>
        </div>
        <AddEditRoleModal
            :show="showAddEditModal"
            :role="currentRole"
            :creating="creating"
            @close="close"
            @success="success" />
    </div>
</template>

<script setup lang="ts">
import { useRoleplayStore } from '@/stores/roleplays';
import AddEditRoleModal from './addEditRoleModal.vue';

type Role = {
    id: number,
    name: string,
    max_users: number,
    roleplay_id: string,
}

type Props = {
    description?: string,
    editable: boolean,
    roles?: Role[]
}

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

const props = withDefaults(defineProps<Props>(), {
    roles: () => ([])
})

const showAddEditModal = ref(false)
const creating = ref(true)

const readableDescription = computed(() => {
    if (props.description) return props.description.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return '';
})

const editRole = (selectedRole: Omit<Role, 'roleplay_id'>) => {
    if (!props.editable) return
    creating.value = false
    currentRole.value = { ...selectedRole, roleplay_id: id.toString() }
    showAddEditModal.value = true
}

const createRole = () => {
    if (!props.editable) return
    creating.value = true
    currentRole.value = Object.assign({}, FormBase)
    showAddEditModal.value = true
}

const success = () => {
    showAddEditModal.value = false
    currentRole.value = Object.assign({}, FormBase)
    loadSingleRP(id.toString())
}

const close = () => {
    currentRole.value = Object.assign({}, FormBase)
    showAddEditModal.value = false
}

</script>

