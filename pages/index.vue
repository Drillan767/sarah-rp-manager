<script setup lang="ts">
const { t } = useI18n({
    useScope: 'local',
})

const messages = ref<string[]>([])

useHead({
    title: t('title'),
})

onMounted(() => {
    for (let i = 0; i <= 30; i++) {
        setTimeout(() => {
            messages.value.push(`Message n°${i +1 }`)
        }, i * 2000)
    }
})

</script>

<template>
    <VContainer>
        <template
            v-for="(message, i) in messages"
            :key="i"
        >
            <VRow
                justify="center"
            >
                <VCol
                    cols="12"
                    md="6"
                    class="d-flex py-0"
                    :class="{'justify-end': i % 2 === 0}"

                >
                    <Transition
                        :appear="true"
                        :name="i % 2 === 0 ? 'slideright' : 'slideleft'"
                    >
                    <VCard
                        :rounded="true"
                        class="mb-2"
                        width="300"
                        :color="i % 2 === 0 ? 'blue' : undefined"
                    >
                        <template #subtitle>
                            {{ i % 2 === 0 ? 'Moi' : 'Sarah' }}
                        </template>
                        <template #text>
                            {{ message }}, Bespoke celiac edison bulb, godard woke kogi
                        </template>
                    </VCard>
                </Transition>
                </VCol>
            </VRow>
        </template>
    </VContainer>
</template>


<style scoped lang="scss">
.slideleft-enter, .slideright-enter { 
  opacity: 0;
}

.slideleft-enter-active, .slideright-enter-active {
    transition: opacity .5s;
}

.slideleft-enter-active {
  animation: slide-left .3s ease-in forwards;
}

.slideright-enter-active {
  animation: slide-right .3s ease-in forwards;
}

@keyframes slide-left {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>

<i18n lang="json">
{
    "fr": {
        "title": "Accueil"
    },
    "en": {
        "title": "Home"
    }
}
</i18n>