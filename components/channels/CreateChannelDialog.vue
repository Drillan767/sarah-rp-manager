<script setup lang="ts">
import type { CurrentUser, OnlineUser } from '~/types/models'

interface Props {
    modelValue: boolean
    onlineUsers: OnlineUser[]
    rpId: string
}

interface Form {
    name: string
    user: OnlineUser
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'update:model-value', value: boolean): void
    (e: 'close'): void
}>()

const currentUser = useState<CurrentUser>('current-user')

const loading = ref(false)

const { defineField, setValues, handleSubmit, resetForm } = useForm<Form>({
    validationSchema: {
        name: 'required',
        user: 'required',
    },
})

const [name, nameProps] = defineField('name', vuetifyConfig)
const [user, userProps] = defineField('user', vuetifyConfig)

const formValid = useIsFormValid()

const valueData = computed({
    get: () => props.modelValue,
    set: value => emit('update:model-value', value),
})

const submit = handleSubmit(async (form) => {
    loading.value = true

    await useFetch('/api/channels/create', {
        method: 'POST',
        body: {
            name: form.name,
            user_id: form.user.user.id,
            rpId: props.rpId,
        },
    })

    loading.value = false
    close()
})

function close() {
    resetForm()
    emit('close')
}

watch(user, (value) => {
    if (value) {
        setValues({
            name: `${currentUser.value.username} & ${value.user.username}`,
        })
    }
    else {
        setValues({ name: undefined })
    }
})
</script>

<template>
    <VDialog
        v-model="valueData"
        max-width="960"
    >
        <VCard
            :loading="loading"
            prepend-icon="mdi-chat"
            title="Nouveau canal de discussion"
        >
            <template #text>
                <VContainer>
                    <VRow>
                        <VCol>
                            <VTextField
                                v-bind="nameProps"
                                v-model="name"
                                label="Nom du canal de discussion"
                                disabled
                            />
                        </VCol>
                    </VRow>
                    <VRow>
                        <VCol>
                            <VSelect
                                v-bind="userProps"
                                v-model="user"
                                :items="onlineUsers"
                                label="Utilisateur "
                                item-value="user.id"
                                item-title="user.username"
                                return-object
                            />
                        </VCol>
                    </VRow>
                </VContainer>
            </template>
            <template #actions>
                <VSpacer />
                <VBtn @click="close">
                    Fermer
                </VBtn>
                <VBtn
                    :disabled="!formValid"
                    :loading="loading"
                    @click="submit"
                >
                    Créer
                </VBtn>
            </template>
        </VCard>
    </VDialog>
</template>
