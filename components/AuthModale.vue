<script setup lang="ts">
import type { Database } from '~/types/supabase'
import useValidation from '~/composables/useValidation'
import { useCurrentUser } from '~/composables/currentUser'
import useSnackBar from "~/composables/snackbar";

const props = defineProps<{ show: boolean }>()

const { t } = useI18n()
const router = useRouter()
const supabase = useSupabaseClient<Database>()
const currentUser = useCurrentUser()
const { showError, showSuccess } = useSnackBar()
const { requiredRule, emailRule, confirmedRule, minLengthRule } = useValidation()

const emit = defineEmits<{
    (e: 'login'): void,
    (e: 'register'): void,
    (e: 'update:show', value: boolean): void;
}>()

const emailError = ref<string | null>(null)
const usernameError = ref<string | null>(null)
const action = ref<'login' | 'register'>('login')
const loading = ref(false)
const loginValid = ref<boolean>()
const registerValid = ref<boolean>()

const loginForm = ref({
    email: '',
    password: '',
})

const registerForm = ref({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
})

const showProxy = computed({
    get: () => props.show,
    set: (value) =>  emit('update:show', value)
})

const submit = async(action: 'login' | 'register') => {
    loading.value = true
    if (action === 'login') {
        try {
            const { data: authData  } = await supabase
                .auth
                .signInWithPassword({
                    email: loginForm.value.email,
                    password: loginForm.value.password,
                })

            if (authData) {
                const { data: userData } = await supabase
                    .from('users')
                    .select('id, session_id, username, superadmin')
                    .eq('session_id', authData.user!.id)
                    .single()

                if (userData) {
                    currentUser.value = userData

                    showSuccess(t('login.success'))
                    showProxy.value = false
                }
            }
        } catch (e: any) {
            console.log(e)
            showError(t('login.error'))
        }
    } else {
        usernameError.value = null
        emailError.value = null

        const { data } = await useFetch('/api/auth/register', {
            method: 'POST',
            body: registerForm.value,
        })

       if (data.value && data.value.length) {
           const [user] = data.value
           currentUser.value = data.value[0]

           showSuccess(t('register.success'))
           showProxy.value = false
       }
    }

    loading.value = false
}

watch(() => registerForm.value.email, async (value) => {
    if (emailRule(value) === true) {
        const { data } = await supabase.from('users').select('id').eq('email', value)

        if (data && data.length) {
            emailError.value = t('form.alreadyExists', { field: t('fields.email') })
        }
    }
})

watch(() => registerForm.value.username, async (value) => {
    if (minLengthRule(value, 6) === true) {
        const { data } = await supabase.from('users').select('id').eq('username', value)

        if (data && data.length) {
            usernameError.value = t('form.alreadyExists', { field: t('fields.username') })
        }
    }
})

const clearField = () => {
    registerValid.value = true
    emailError.value = null
    usernameError.value = null
}

</script>

<template>
    <VDialog
        v-model="showProxy"
        :persistent="true"
        width="700"

    >
        <VCard
            prepend-icon="mdi-account-question"
            :loading="loading"
        >
            <template #title>
                {{ t('common.login') }}
            </template>
            <template #text>
                <VTabs
                    v-model="action"
                    :grow="true"
                >
                    <VTab
                        value="login"
                    >
                        {{ t('login.action') }}
                    </VTab>
                    <VTab
                        value="register"
                    >
                        {{ t('register.action') }}
                    </VTab>
                </VTabs>
                <VWindow
                    v-model="action"
                >
                    <VWindowItem
                        value="login"
                    >
                        <VForm
                            v-model="loginValid"
                            class="mt-4"
                        >
                            <VTextField
                                v-model="loginForm.email"
                                :rules="[emailRule, requiredRule]"
                                :label="t('fields.email')"
                                type="email"
                                color="primary"
                                variant="outlined"
                            />
                            <VTextField
                                v-model="loginForm.password"
                                :rules="[requiredRule]"
                                :label="t('fields.password')"
                                type="password"
                                color="primary"
                                variant="outlined"
                            />
                        </VForm>
                    </VWindowItem>
                    <VWindowItem
                        value="register"
                    >
                        <VForm
                            v-model="registerValid"
                            class="mt-4"
                        >
                            <VTextField
                                v-model="registerForm.email"
                                :rules="[emailRule, requiredRule]"
                                :label="t('fields.email')"
                                :error-messages="emailError"
                                :clearable="true"
                                class="mb-4"
                                type="email"
                                color="primary"
                                variant="outlined"
                                @click:clear.prevent="clearField"
                            />
                            <VTextField
                                v-model="registerForm.username"
                                :rules="[requiredRule]"
                                :label="t('fields.username')"
                                :error-messages="usernameError"
                                :clearable="true"
                                class="mb-4"
                                color="primary"
                                variant="outlined"
                                @click:clear.prevent="clearField"
                            />
                            <VTextField
                                v-model="registerForm.password"
                                :rules="[requiredRule, minLengthRule(registerForm.password, 6)]"
                                :label="t('fields.password')"
                                class="mb-4"
                                type="password"
                                color="primary"
                                variant="outlined"
                            />
                            <VTextField
                                v-model="registerForm.repeatPassword"
                                :rules="[requiredRule, confirmedRule(registerForm.password, registerForm.repeatPassword)]"
                                :label="t('fields.confirm_password')"
                                class="mb-4"
                                type="password"
                                color="primary"
                                variant="outlined"
                            />
                        </VForm>
                    </VWindowItem>
                </VWindow>
            </template>
            <template #actions>
                <VSpacer />
                <VBtn
                    variant="text"
                    @click="router.push('/')"
                >
                    {{ t('form.cancel') }}
                </VBtn>
                <VBtn
                    color="primary"
                    :disabled="(action === 'login' && !loginValid) || (action === 'register' && !registerValid)"
                    @click="submit(action)"
                >
                    {{ t(action === 'login' ? 'login.action' : 'register.action') }}
                </VBtn>
            </template>
        </VCard>
    </VDialog>

</template>
