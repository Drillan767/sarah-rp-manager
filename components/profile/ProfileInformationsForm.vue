<script setup lang="ts">
import { useForm, useIsFormValid } from 'vee-validate'
import type { Database } from '~/types/supabase'
import { vuetifyConfig } from '~/composables/vuetifyConfig'
import useSnackBar from '~/composables/snackbar'

interface UserData {
    email: string
    username: string
    description: string | null
}

const { t } = useI18n()
const supabase = useSupabaseClient<Database>()
const session = useSupabaseUser()
const { showSuccess } = useSnackBar()

const { defineField, setValues, handleSubmit } = useForm<UserData>({
    validationSchema: {
        username: 'min:4|required',
    },
})

const formValid = useIsFormValid()

const [email, emailProps] = defineField('email', vuetifyConfig)
const [username, usernameProps] = defineField('username', vuetifyConfig)
const [description, descriptionProps] = defineField('description', vuetifyConfig)

const loading = ref(false)

onMounted(async () => {
    loading.value = true
    const { data } = await supabase
        .from('users')
        .select('email, username, description')
        .eq('session_id', session.value!.id)
        .single()

    if (data)
        setValues(data)

    loading.value = false
})

const submit = handleSubmit(async (values) => {
    loading.value = true

    await supabase
        .from('users')
        .update(values)
        .eq('session_id', session.value!.id)

    loading.value = false

    showSuccess(t('pages.profile.success.infos'))
})
</script>

<template>
    <VCard
        prepend-icon="mdi-account"
        :loading="loading"
        class="mb-4"
    >
        <template #title>
            {{ t('pages.profile.page') }}
        </template>

        <VForm @submit.prevent="submit">
            <VContainer>
                <VRow>
                    <VCol
                        cols="12"
                        md="6"
                    >
                        <VTextField
                            v-bind="emailProps"
                            v-model="email"
                            :label="t('fields.email')"
                            :disabled="true"
                        />
                    </VCol>
                    <VCol
                        cols="12"
                        md="6"
                    >
                        <VTextField
                            v-bind="usernameProps"
                            v-model="username"
                            :label="t('fields.username')"
                        />
                    </VCol>
                </VRow>
                <VRow>
                    <VCol>
                        <VTextarea
                            v-bind="descriptionProps"
                            v-model="description"
                            label="Description"
                            :auto-grow="true"
                        />
                    </VCol>
                </VRow>
            </VContainer>
            <VCardActions class="d-flex justify-end">
                <VBtn
                    color="primary"
                    type="submit"
                    :disabled="!formValid"
                >
                    {{ t('form.save') }}
                </VBtn>
            </VCardActions>
        </VForm>
    </VCard>
</template>
