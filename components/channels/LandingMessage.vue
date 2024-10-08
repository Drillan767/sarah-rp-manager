<script setup lang="ts">
import { mergeProps } from 'vue'

interface Props {
    message: {
        id: number
        message: string
        created_at: string
        url?: string
        media?: string
        sender: string
        reactions: {
            smiley: string
            users: string[]
        }[]
    }
    fromSender?: boolean
    enableInteractions?: boolean
}

const props = defineProps<Props>()

const { t } = useI18n()
const dayjs = useDayjs()

const creationDate = computed(() => {
    const initialDate = dayjs(props.message.created_at)
    const format = initialDate.isSame(dayjs(), 'day') ? 'HH:mm' : 'DD/MM/YYYY HH:mm'

    return initialDate.format(format)
})
</script>

<template>
    <VCol
        cols="12"
        md="6"
        class="d-flex py-0"
        :class="{ 'justify-end': fromSender }"
    >
        <Transition
            :appear="true"
            :name="fromSender ? 'slideright' : 'slideleft'"
        >
            <VCard
                :rounded="true"
                class="mb-2"
                max-width="300"
                :to="message.url ?? undefined"
                :color="fromSender ? 'blue' : undefined"
            >
                <template #subtitle>
                    <div
                        class="d-flex justify-space-between gap-x-2"
                        :class="{ 'flex-row-reverse': fromSender }"
                    >
                        <span>
                            {{ message.sender }}
                        </span>
                        <span>
                            {{ creationDate }}
                        </span>
                    </div>
                </template>
                <template #text>
                    {{ message.message }}
                </template>
                <VCardActions
                    v-if="enableInteractions || message.reactions.length"
                >
                    <VMenu v-if="enableInteractions">
                        <template #activator="{ props: menu }">
                            <VTooltip
                                location="top"
                                :text="t('add_emoji')"
                            >
                                <template #activator="{ props: tooltip }">
                                    <VChip v-bind="mergeProps(menu, tooltip)">
                                        <VIcon icon="mdi-plus-circle-outline" />
                                    </VChip>
                                </template>
                            </VTooltip>
                        </template>
                    </VMenu>
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
                </VCardActions>
            </VCard>
        </Transition>
    </VCol>
</template>
