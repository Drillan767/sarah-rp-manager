<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()
const { t } = useI18n()

const action = ref<'login' | 'register'>('login')
const loading = ref(false)

const showProxy = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
})

function authSuccessful() {
    showProxy.value = false
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
                    <VWindowItem value="login">
                        <RpAuthLogin
                            v-model:loading="loading"
                            @login="authSuccessful"
                        />
                    </VWindowItem>
                    <VWindowItem value="register">
                        <RpAuthRegister
                            v-model:loading="loading"
                            @register="authSuccessful"
                        />
                    </VWindowItem>
                </VWindow>
            </template>
        </VCard>
    </VDialog>
</template>
