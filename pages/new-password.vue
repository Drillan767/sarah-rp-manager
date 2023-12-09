<script setup lang="ts">
import { useForm, useIsFormValid } from 'vee-validate'
import { useRouteQuery  } from '@vueuse/router'
import { vuetifyConfig } from '~/composables/vuetifyConfig';

const { t } = useI18n()
const router = useRouter()
const supabase = useSupabaseClient()

const code = useRouteQuery('code')

if (!code.value) router.push('/login')

useHead({
    title: t('newPwd.title'),
})

const { defineField, handleSubmit } = useForm({
    validationSchema: {
        password: 'required|min:6',
        repeatPassword: 'required|confirmed:@password',
    }
})

const [pwd, pwdProps] = defineField('password', vuetifyConfig)
const [confirmPwd, confirmPwdProps] = defineField('repeatPassword', vuetifyConfig)
const loading = ref(false)

const formValid = useIsFormValid()

const submit = handleSubmit(async(values) => {
    loading.value = true
    await supabase.auth.updateUser({
        password: values.password,
    })
    loading.value = false
})

</script>

<template>
    <VForm @submit.prevent="submit">
        <h1 class="text-h3 font-weight-bold text-indigo mb-4">
            {{ t('newPwd.title') }}
        </h1>

        <VTextField
            v-bind="pwdProps"
            v-model="pwd"
            type="password"
            variant="underlined"
            :label="t('fields.password')"
            class="mb-4"
        />

        <VTextField
            v-bind="confirmPwdProps"
            v-model="confirmPwd"
            type="password"
            variant="underlined"
            :label="t('fields.confirm_password')"
            class="mb-4"
        />

        <div class="d-flex justify-center">
            <div class="d-flex justify-center w-full lg:w-1/2">
                <VBtn
                    :loading="loading"
                    :disabled="loading || !formValid"
                    elevation="0"
                    type="submit"
                    color="primary"
                    size="large"
                    rounded="lg"
                    :block="true"
                >
                    {{ t('form.save') }}
                </VBtn>
            </div>
        </div>

    </VForm>
</template>