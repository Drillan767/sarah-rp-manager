<script setup lang="ts">
import { ErrorMessage, Field, Form, configure, defineRule } from 'vee-validate'
import { localize } from '@vee-validate/i18n'
import { confirmed, min, required } from '@vee-validate/rules'
import { useUserStore } from '@/stores/users'

defineProps<{ show: boolean }>()
const emit = defineEmits<{
    (e: 'close'): void
    (e: 'success'): void
}>()

defineRule('required', required)
defineRule('confirmed', confirmed)
defineRule('min', min)

configure({
    generateMessage: localize('fr', {
        messages: {
            required: 'Le champ est requis',
            confirmed: 'Les mots de passe ne correspondent pas',
            min: 'Mot de passe trop court',
        },
    }),
})

const userStore = useUserStore()

const loading = ref(false)
const newPassword = ref('')
const repeatPassword = ref('')

const { updatePassword } = userStore

async function submit() {
    loading.value = true
    await updatePassword(newPassword.value)
    loading.value = false
    emit('success')
}

onMounted(() => {
    addEventListener('keydown', (e) => {
        if (e.key === 'Escape')
            emit('close')
    })
})
</script>

<template>
    <dialog
        id="my_modal_1"
        class="modal"
        :class="{ 'modal-open': show }"
    >
        <div class="modal-box">
            <Form @submit="submit">
                <h3 class="font-bold text-lg mb-4">
                    Nouveau mot de passe
                </h3>
                <div class="w-full mb-4">
                    <label
                        for="newPassword"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Nouveau mot de passe
                    </label>
                    <Field
                        id="newPassword"
                        v-model="newPassword"
                        name="newPassword"
                        type="password"
                        rules="required|min:6"
                        placeholder="Mot de passe"
                        class="input input-bordered w-full"
                        required
                    />
                    <ErrorMessage
                        name="newPassword"
                        class="text-red-500"
                    />
                </div>
                <div class="w-full mb-4">
                    <label
                        for="repeatPassword"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Répéter le mot de passe
                    </label>
                    <Field
                        id="repeatPassword"
                        v-model="repeatPassword"
                        name="repeatPassword"
                        type="password"
                        rules="required|confirmed:@newPassword"
                        placeholder="Répéter mot de passe"
                        class="input input-bordered w-full"
                        required
                    />
                    <ErrorMessage
                        name="repeatPassword"
                        class="text-red-500"
                    />
                </div>
                <p class="py-4">
                    Press ESC key or click the button below to close
                </p>
                <div class="modal-action">
                    <button
                        class="btn"
                        @click.prevent="emit('close')"
                    >
                        Fermer
                    </button>
                    <button
                        class="btn btn-primary"
                        type="submit"
                        :disabled="loading"
                    >
                        Enregistrer
                    </button>
                </div>
            </Form>
        </div>
    </dialog>
</template>
