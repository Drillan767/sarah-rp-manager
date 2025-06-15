<script setup lang="ts">
import { computed } from 'vue'
import useDayjs from '@/composables/dayjs'

const props = defineProps<{
    message: {
        message: string
        createdAt: string
        url?: string
        reactions: {
            smiley: string
            users: string[]
        }[]
        user: {
            username: string
        }
    }
    fromSender: boolean

}>()

const dayjs = useDayjs()

const transition = computed(() => {
    return props.fromSender ? 'v-slide-x-reverse-transition' : 'v-slide-x-transition'
})
</script>

<template>
    <VRow class="px-0 ma-0">
        <VCol>
            <VRow>
                <VCol
                    class="d-flex"
                    :class="{ 'justify-end': fromSender }"
                >
                    <component :is="transition">
                        <VCard
                            :color="fromSender ? 'primary' : undefined"
                            :to="message.url ? { name: message.url } : undefined"
                            class="mb-2"
                            max-width="300"
                            rounded
                        >
                            <template #subtitle>
                                <div
                                    class="d-flex justify-space-between gap-x-2"
                                    :class="{ 'flex-row-reverse': fromSender }"
                                >
                                    <span>
                                        {{ message.user.username }}
                                    </span>
                                    <span class="mr-2">
                                        {{ dayjs(message.createdAt).format('HH:mm') }}
                                    </span>
                                </div>
                            </template>
                            <template #text>
                                {{ message.message }}
                            </template>
                            <template
                                v-if="message.reactions.length > 0"
                                #actions
                            >
                                <VTooltip
                                    v-for="(reaction, i) in message.reactions"
                                    :key="i"
                                    location="bottom"
                                    :text="reaction.users[0]"
                                >
                                    <template #activator="{ props: tooltip }">
                                        <VChip
                                            v-bind="tooltip"
                                        >
                                            {{ reaction.smiley }}
                                        </VChip>
                                    </template>
                                </VTooltip>
                            </template>
                        </VCard>
                    </component>
                </VCol>
            </VRow>
        </VCol>
    </VRow>
</template>
