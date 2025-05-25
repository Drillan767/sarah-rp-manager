<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import landingMessages from '@/assets/json/landing-messages.json'
import Message from '@/components/channels/Message.vue'
import useDayjs from '@/composables/dayjs'
import useUsersStore from '@/stores/users'

interface IMessage {
    id: number
    message: string
    created_at: string
    url?: string
    media?: string
    sender: string
    from_sender: boolean
    reactions: {
        smiley: string
        users: string[]
    }[]
}

const dayjs = useDayjs()
const displayedMessages = ref<IMessage[]>([])
const { user } = storeToRefs(useUsersStore())

const username = computed(() => user.value?.username ?? 'Vous')

const messages = {
    sender: {
        message1: 'On fait quoi ce soir ?',
        message2: 'Merci !',
        message3: 'Ah et je joue qui ?',
        message4: 'Trop bien !',
        message5: 'Les gens savent que je suis là ?',
    },
    sarah: {
        message1: 'Accède à tes roleplays',
        message2: 'Regarde tous tes personnages disponibles',
        message3: 'Modifie tes disponibilités',
    },
}

function displayMessage() {
    landingMessages.forEach((message, i) => {
        const [sender, messageKey] = message.message.split('.')
        setTimeout(() => {
            displayedMessages.value.push({
                id: message.id,
                message: messages[sender][messageKey],
                created_at: dayjs().toISOString(),
                url: message.url ?? undefined,
                reactions: [],
                from_sender: message.from_sender,
                user: {
                    username: message.from_sender ? username.value : 'Sarah',
                },
            })
        }, i * 2000)

        if (message.emoji) {
            setTimeout(() => {
                displayedMessages.value[i].reactions.push({
                    smiley: message.emoji,
                    users: [message.from_sender ? 'Sarah' : username.value],
                })
            }, (i * 2000) + 750)
        }
    })
}

onMounted(displayMessage)
</script>

<template>
    <VContainer>
        <VRow justify="center">
            <VAvatar
                class="my-4"
                image="/sarah.jpg"
                :size="130"
            />
        </VRow>
        <VRow>
            <VCol>
                <h1 class="text-center">
                    Dis Sarah...
                </h1>
            </VCol>
        </VRow>
        <VRow
            v-for="(message, i) in displayedMessages"
            :key="i"
            justify="center"
        >
            <Message
                :message="message"
                :enable-interactions="false"
                :from-sender="message.from_sender"
            />
        </VRow>
    </VContainer>
</template>
