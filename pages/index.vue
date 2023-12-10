<script setup lang="ts">
import { useCurrentUser } from '~/composables/currentUser'
import messageList from '~/assets/json/landing-messages.json'
import Message from '~/components/channels/Message.vue'

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

const { t } = useI18n({
    useScope: 'local',
})

const currentUser = useCurrentUser()
const dayjs = useDayjs()

const username = ref('')

const messages = ref<IMessage[]>([])
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
                message: t(message.message),
                created_at: dayjs().toISOString(),
                url: message.url ?? undefined,
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
                    {{ t('say') }} Sarah...
                </h1>
            </VCol>
        </VRow>
        <VRow
            v-for="(message, i) in messages"
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
        "say": "Dis",
        "sarah": {
            "message1": "Accède à tes roleplays",
            "message2": "Regarde tous tes personnages disponibles",
            "message3": "Modifie tes disponibilités"
        },
        "sender": {
            "message1": "On fait quoi ce soir ?",
            "message2": "Merci !",
            "message3": "Ah et je joue qui ?",
            "message4": "Trop bien !",
            "message5": "Les gens savent que je suis là ?"
        }
    },
    "en": {
        "me": "Me",
        "title": "Home",
        "say": "Say",
        "sarah": {
            "message1": "Access your roleplays",
            "message2": "Check all your current characters",
            "message3": "Change your availability"
        },
        "sender": {
            "message1": "What are we doing tonight?",
            "message2": "Thanks!",
            "message3": "Oh and who do I play as?",
            "message4": "Cool!",
            "message5": "The others know I am here, right?"
        }
    }
}
</i18n>
