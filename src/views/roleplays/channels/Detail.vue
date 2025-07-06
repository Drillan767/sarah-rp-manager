<script setup lang="ts">
import type { ListChannelsForRoleplayData } from '@sarah-rp-manager/default-connector'
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import useChat from '@/composables/chat'
import useUsersStore from '@/stores/users'

type Channels = NonNullable<ListChannelsForRoleplayData['channels']>

interface Props {
    messages: any[]
    typingUsers: any[]
    channels: Channels
}

const props = defineProps<Props>()

const route = useRoute()
const { user } = storeToRefs(useUsersStore())
const {
    sendMessage,
    setTypingStatus,
    setPresence,
} = useChat()

const newMessage = ref('')
const messagesContainer = ref<HTMLElement>()
const isTyping = ref(false)
const typingTimeout = ref<ReturnType<typeof setTimeout>>()

const roleplayId = route.params.id as string
const channelId = computed(() => route.params.channelId as string)

// Get current channel information
const currentChannel = computed(() => {
    return props.channels.find(channel => channel.id === channelId.value)
})

// Auto-scroll to bottom when new messages arrive
function scrollToBottom() {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
    })
}

// Handle typing with debounce
function handleTyping() {
    if (!isTyping.value) {
        isTyping.value = true
        setTypingStatus(true, roleplayId, channelId.value)
    }

    // Clear existing timeout
    if (typingTimeout.value) {
        clearTimeout(typingTimeout.value)
    }

    // Set new timeout
    typingTimeout.value = setTimeout(() => {
        isTyping.value = false
        setTypingStatus(false, roleplayId, channelId.value)
    }, 500)
}

// Send message
async function handleSendMessage() {
    if (!newMessage.value.trim() || !user.value)
        return

    await sendMessage(newMessage.value, roleplayId, channelId.value)
    newMessage.value = ''
    setTypingStatus(false, roleplayId, channelId.value)
    isTyping.value = false

    if (typingTimeout.value) {
        clearTimeout(typingTimeout.value)
    }
}

// Handle enter key
function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        handleSendMessage()
    }
}

// Format timestamp
function formatTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    })
}

// Check if message is from current user
function isOwnMessage(messageUserId: string) {
    return messageUserId === user.value?.id
}

onMounted(scrollToBottom)

onUnmounted(() => {
    setPresence(roleplayId, false)

    if (typingTimeout.value) {
        clearTimeout(typingTimeout.value)
    }
})

watch(() => props.messages, scrollToBottom, { deep: true })

// Watch for channel changes
watch(() => route.params.channelId, () => {
    // Clear current state when switching channels
    newMessage.value = ''
    isTyping.value = false
    if (typingTimeout.value) {
        clearTimeout(typingTimeout.value)
    }

    scrollToBottom()
})
</script>

<template>
    <VContainer fluid class="pa-0 h-100">
        <VRow no-gutters class="h-100">
            <VCol class="d-flex flex-column h-100">
                <VCard flat class="rounded-0 border-b">
                    <VCardTitle class="text-h6 pa-4">
                        <VIcon icon="mdi-message-text" class="me-2" />
                        {{ currentChannel?.name || 'Canal' }}
                    </VCardTitle>
                </VCard>

                <!-- Messages Container -->
                <VCard flat class="flex-grow-1 rounded-0 d-flex flex-column">
                    <div
                        ref="messagesContainer"
                        class="flex-grow-1 pa-4 overflow-y-auto"
                        style="max-height: calc(100vh - 200px);"
                    >
                        <div v-if="props.messages.length === 0" class="text-center pa-8">
                            <VIcon icon="mdi-message-outline" size="64" class="text-grey-lighten-1 mb-4" />
                            <p class="text-grey-lighten-1">
                                Aucun message pour le moment
                            </p>
                            <p class="text-caption text-grey-lighten-2">
                                Soyez le premier à envoyer un message !
                            </p>
                        </div>

                        <div v-else class="d-flex flex-column gap-3">
                            <div
                                v-for="message in props.messages"
                                :key="message.id"
                                class="d-flex"
                                :class="{ 'justify-end': isOwnMessage(message.userId) }"
                            >
                                <VCard
                                    class="pa-3 max-width-70"
                                    :class="[
                                        isOwnMessage(message.userId)
                                            ? 'bg-primary text-white'
                                            : 'bg-grey-lighten-4',
                                    ]"
                                    flat
                                >
                                    <div class="d-flex align-center mb-2">
                                        <VAvatar
                                            :image="message.avatar"
                                            :alt="message.username"
                                            size="24"
                                            class="me-2"
                                        />
                                        <span class="text-caption font-weight-medium">
                                            {{ message.username }}
                                        </span>
                                        <VSpacer />
                                        <span class="text-caption opacity-75">
                                            {{ formatTime(message.timestamp) }}
                                        </span>
                                    </div>
                                    <p class="mb-0 text-body-2">
                                        {{ message.content }}
                                    </p>
                                </VCard>
                            </div>
                        </div>

                        <!-- Typing Indicator -->
                        <div v-if="props.typingUsers.length > 0" class="d-flex align-center pa-2">
                            <VCard flat class="bg-grey-lighten-4 pa-2">
                                <div class="d-flex align-center">
                                    <VAvatar
                                        v-for="typingUser in props.typingUsers"
                                        :key="typingUser.userId"
                                        :image="typingUser.avatar"
                                        :alt="typingUser.username"
                                        size="20"
                                        class="me-1"
                                    />
                                    <span class="text-caption text-grey-darken-1">
                                        {{ props.typingUsers.map(u => u.username).join(', ') }}
                                        {{ props.typingUsers.length === 1 ? 'tape' : 'tape' }}...
                                    </span>
                                </div>
                            </VCard>
                        </div>
                    </div>

                    <!-- Message Input -->
                    <VCard flat class="border-t pa-4">
                        <VForm @submit.prevent="handleSendMessage">
                            <div class="d-flex align-end gap-2">
                                <VTextField
                                    v-model="newMessage"
                                    :disabled="!user"
                                    placeholder="Tapez votre message..."
                                    variant="outlined"
                                    density="compact"
                                    hide-details
                                    class="flex-grow-1"
                                    autocomplete="off"
                                    @input="handleTyping"
                                    @keypress="handleKeyPress"
                                />
                                <VBtn
                                    :disabled="!newMessage.trim() || !user"
                                    class="ml-2"
                                    size="small"
                                    type="submit"
                                    color="primary"
                                    icon="mdi-send"
                                />
                            </div>
                        </VForm>
                    </VCard>
                </VCard>
            </VCol>
        </VRow>
    </VContainer>
</template>

<style scoped>
.max-width-70 {
    max-width: 70%;
}

.border-b {
    border-bottom: 1px solid rgb(var(--v-border-color));
}

.border-t {
    border-top: 1px solid rgb(var(--v-border-color));
}

/* Custom scrollbar for messages */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(var(--v-theme-on-surface), 0.2);
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(var(--v-theme-on-surface), 0.3);
}
</style>
