<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import useChat from '@/composables/chat'
import useUsersStore from '@/stores/users'

const route = useRoute()
const { user } = storeToRefs(useUsersStore())
const {
    messages,
    typingUsers,
    isLoading,
    subscribeToMessages,
    sendMessage,
    setTypingStatus,
    setPresence,
    loadMessageHistory,
} = useChat()

const newMessage = ref('')
const messagesContainer = ref<HTMLElement>()
const isTyping = ref(false)
const typingTimeout = ref<ReturnType<typeof setTimeout>>()

const roleplayId = route.params.roleplayId as string
const channelId = route.params.channelId as string

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
        setTypingStatus(true, roleplayId, channelId)
    }

    // Clear existing timeout
    if (typingTimeout.value) {
        clearTimeout(typingTimeout.value)
    }

    // Set new timeout
    typingTimeout.value = setTimeout(() => {
        isTyping.value = false
        setTypingStatus(false, roleplayId, channelId)
    }, 1000)
}

// Send message
async function handleSendMessage() {
    if (!newMessage.value.trim() || !user.value)
        return

    await sendMessage(newMessage.value, roleplayId, channelId)
    newMessage.value = ''
    setTypingStatus(false, roleplayId, channelId)
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

let unsubscribe: (() => void) | undefined

onMounted(async () => {
    // Load message history first
    await loadMessageHistory(roleplayId, channelId)

    // Subscribe to messages
    unsubscribe = subscribeToMessages(roleplayId, channelId)

    // Set presence as online
    setPresence(roleplayId, true)

    // Scroll to bottom initially
    scrollToBottom()
})

onUnmounted(() => {
    // Cleanup
    if (unsubscribe) {
        unsubscribe()
    }

    // Set presence as offline
    setPresence(roleplayId, false)

    // Clear typing timeout
    if (typingTimeout.value) {
        clearTimeout(typingTimeout.value)
    }
})

// Watch messages for auto-scroll
watch(messages, scrollToBottom, { deep: true })
</script>

<template>
    <VContainer fluid class="pa-0 h-100">
        <VRow no-gutters class="h-100">
            <!-- Chat Messages Area -->
            <VCol class="d-flex flex-column h-100">
                <!-- Messages Header -->
                <VCard flat class="rounded-0 border-b">
                    <VCardTitle class="text-h6 pa-4">
                        <VIcon icon="mdi-message-text" class="me-2" />
                        {{ route.params.channelName || 'Canal' }}
                    </VCardTitle>
                </VCard>

                <!-- Messages Container -->
                <VCard flat class="flex-grow-1 rounded-0 d-flex flex-column">
                    <div
                        ref="messagesContainer"
                        class="flex-grow-1 pa-4 overflow-y-auto"
                        style="max-height: calc(100vh - 200px);"
                    >
                        <div v-if="isLoading" class="d-flex justify-center pa-4">
                            <VProgressCircular indeterminate />
                        </div>

                        <div v-else-if="messages.length === 0" class="text-center pa-8">
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
                                v-for="message in messages"
                                :key="message.id"
                                class="d-flex"
                                :class="{ 'justify-end': isOwnMessage(message.userId) }"
                            >
                                <VCard
                                    class="pa-3 max-width-70" :class="[
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
                        <div v-if="typingUsers.length > 0" class="d-flex align-center pa-2">
                            <VCard flat class="bg-grey-lighten-4 pa-2">
                                <div class="d-flex align-center">
                                    <VAvatar
                                        v-for="typingUser in typingUsers"
                                        :key="typingUser.userId"
                                        :image="typingUser.avatar"
                                        :alt="typingUser.username"
                                        size="20"
                                        class="me-1"
                                    />
                                    <span class="text-caption text-grey-darken-1">
                                        {{ typingUsers.map(u => u.username).join(', ') }}
                                        {{ typingUsers.length === 1 ? 'tape' : 'tape' }}...
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
                                    placeholder="Tapez votre message..."
                                    variant="outlined"
                                    density="compact"
                                    hide-details
                                    class="flex-grow-1"
                                    :disabled="!user"
                                    @input="handleTyping"
                                    @keypress="handleKeyPress"
                                />
                                <VBtn
                                    type="submit"
                                    color="primary"
                                    :disabled="!newMessage.trim() || !user"
                                    :loading="isLoading"
                                >
                                    <VIcon icon="mdi-send" />
                                </VBtn>
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
