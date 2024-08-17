<script setup lang="ts">
import { useForm, useIsFormValid } from 'vee-validate'
import type { Database } from '~/types/supabase'
import { vuetifyConfig } from '~/composables/vuetifyConfig'
import useSnackBar from '~/composables/snackbar'

interface ILogin {
    email: string
    password: string
}

const props = defineProps<{ loading: boolean }>()
const emit = defineEmits<{
    (e: 'update:loading', value: boolean): void
    (e: 'login'): void
}>()

const { showSuccess } = useSnackBar()
const { t } = useI18n()
const router = useRouter()
const supabase = useSupabaseClient<Database>()

const loadingProxy = computed({
    get: () => props.loading,
    set: value => emit('update:loading', value),
})

const { defineField, handleSubmit } = useForm<ILogin>({
    validationSchema: {
        email: 'email|required',
        password: 'required',
    },
})

const [email, emailProps] = defineField('email', vuetifyConfig)
const [password, passwordProps] = defineField('password', vuetifyConfig)
const formValid = useIsFormValid()

const submit = handleSubmit(async (loginForm) => {
    loadingProxy.value = true
    try {
        const { data: authData } = await supabase
            .auth
            .signInWithPassword({
                email: loginForm.email,
                password: loginForm.password,
            })

        if (authData) {
            const { data: userData } = await supabase
                .from('users')
                .select('id, session_id, username, superadmin')
                .eq('session_id', authData.user!.id)
                .single()

            if (userData) {
                showSuccess(t('login.success'))

                emit('login')
            }
        }
    }
    catch (e: any) {
        console.error(e)
        showError(t('login.error'))
    }
    finally {
        loadingProxy.value = false
    }
})
</script>

<template>
    <VForm
        class="mt-4"
        @submit.prevent="submit"
    >
        <VContainer>
            <VRow>
                <VCol>
                    <VTextField
                        v-bind="emailProps"
                        v-model="email"
                        :label="t('fields.email')"
                        type="email"
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <VTextField
                        v-bind="passwordProps"
                        v-model="password"
                        :label="t('fields.password')"
                        type="password"
                    />
                </VCol>
            </VRow>
            <VRow>
                <VCol class="d-flex justify-end pe-0">
                    <VBtn
                        variant="text"
                        @click="router.push('/')"
                    >
                        {{ t('form.cancel') }}
                    </VBtn>
                    <VBtn
                        color="primary"
                        variant="text"
                        :disabled="!formValid"
                        type="submit"
                    >
                        {{ t('login.action') }}
                    </VBtn>
                </VCol>
            </VRow>
        </VContainer>
    </VForm>
</template>
