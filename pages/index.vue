<script setup lang="ts">
import { useCurrentUser } from '~/composables/currentUser'
import messageList from '~/assets/json/landing-messages.json'
import Message from '~/components/channels/Message.vue'

interface Message {
    id: number,
    message: string
    created_at: string,
    url?: string,
    media?: string,
    sender: string,
    from_sender: boolean,
    reactions: {
        smiley: string,
        users: string[],
    }[]
}

const { t } = useI18n({
    useScope: 'local',
})

const currentUser = useCurrentUser()
const dayjs = useDayjs()

const username = ref('')

const messages = ref<Message[]>([])
const user = useSupabaseUser()

username.value = user.value ? currentUser.value.username : t('me')

useHead({
    title: t('title'),
})

onMounted(() => {
    messageList.forEach((message, i) => {
        setTimeout(() => {
            messages.value.push({
                id: message.id,
                message: message.message,
                created_at: dayjs().toISOString(),
                reactions: [],
                from_sender: message.from_sender,
                sender: message.from_sender ? username.value : 'Sarah',
            })
        }, i * 2000)

        if (message.emoji) {
            setTimeout(() => {
                messages.value[i].reactions.push({
                    smiley: message.emoji,
                    users: [message.from_sender ? 'Sarah' : username.value],
                })
            }, (i * 2000) + 500)

        }
    })
})

const addReaction = () => {
    messages.value[2].reactions.push({
        smiley: '😂',
        users: ['Random boug']
    })
}

</script>

<template>
    <VContainer>
        <VRow>
            <VBtn @click="addReaction">
                Ajouter une réaction
            </VBtn>
        </VRow>
        <template
            v-for="(message, i) in messages"
            :key="i"
        >
            <VRow
                justify="center"
            >
                <Message
                    :message="message"
                    :enable-interactions="false"
                    :from-sender="message.from_sender"
                />
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
        "me": "Moi",
        "title": "Accueil",
        "add_emoji": "Ajouter une réaction"
    },
    "en": {
        "me": "Me",
        "title": "Home",
        "add_emoji": "Add a reaction"
    }
}
</i18n>