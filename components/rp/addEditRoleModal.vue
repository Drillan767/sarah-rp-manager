<template>
    <dialog id="my_modal_1" class="modal" :class="{ 'modal-open': show }">
        <div class="modal-box">
            <Form @submit="submit">
                <h3 class="font-bold text-lg mb-4">{{ creating ? 'Nouveau rôle' : `Éditer "${props.role.name}"` }}</h3>
                <div class="w-full mb-4">
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Nom
                    </label>
                    <Field v-model="formProxy.name" name="name" type="text" rules="required" id="name" placeholder="Nom du rôle"
                        class="input input-bordered w-full" required />
                    <ErrorMessage name="name" class="text-red-500" />
                </div>
                <div class="w-full mb-4">
                    <label for="max_users" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Nombre d'utilisateurs
                    </label>
                    <Field v-model="formProxy.max_users" name="max_users" type="number" rules="required|min_value:1"
                        id="max_users" placeholder="Nombre de personnes" class="input input-bordered w-full" required />
                    <ErrorMessage name="max_users" class="text-red-500" />
                </div>
                <div class="modal-action">
                    <button class="btn" @click.prevent="emit('close')">Fermer</button>
                    <button class="btn btn-primary" type="submit" :disabled="loading">
                        Enregistrer
                    </button>
                </div>
            </Form>
        </div>

    </dialog>
</template>

<script setup lang="ts">
import type { Database } from 'types/supabase';
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { localize } from '@vee-validate/i18n'
import { required, confirmed, min_value } from '@vee-validate/rules'

type Creating = {
    role: {
        name: string,
        max_users: number,
        roleplay_id: string,
    }
    creating: true,
}

type Editing = {
    role: {
        id: number,
        name: string,
        max_users: number,
        roleplay_id: string,
    }
    creating: false,
}

type Props = (Creating | Editing) & {
    show: boolean,
}

defineRule('required', required)
defineRule('confirmed', confirmed)
defineRule('min_value', min_value)

configure({
    generateMessage: localize('fr', {
        messages: {
            required: 'Le champ est requis',
            confirmed: 'Les mots de passe ne correspondent pas',
            min_value: 'Il doit y avoir un minimum d\'un membre pour un rôle'
        },
    }),
})

const supabase = useSupabaseClient<Database>()

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'input', value: Props['role']): void,
    (e: 'close'): void,
    (e: 'success'): void,
}>()

const loading = ref(false)

const formProxy = computed({
    get: () => props.role,
    set: (value) => emit('input', value)
})

const submit = async () => {
    if (props.creating) {
        await supabase
            .from('roles')
            .insert(formProxy.value)
    } else {
        await supabase
            .from('roles')
            .update({
                name: formProxy.value.name,
                max_users: formProxy.value.max_users,
            })
            .eq('id', props.role.id)
    }

    emit('success')
}

onMounted(() => {
    addEventListener('keydown', (e) => {
        if (e.key === 'Escape') emit('close')
    })
})

</script>