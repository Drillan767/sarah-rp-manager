import {
    createMessage,
    getMessages,
} from '@sarah-rp-manager/default-connector'
import { ref as dbRef, off, onValue, push, serverTimestamp, set } from 'firebase/database'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import useUsersStore from '@/stores/users'
import useFirebase from './firebase'

interface ChatMessage {
    id: string
    content: string
    userId: string
    username: string
    avatar: string
    timestamp: number
    channelId: string
    roleplayId: string
}

interface TypingStatus {
    userId: string
    username: string
    avatar: string
    isTyping: boolean
    timestamp: number
}

export default function useChat() {
    const { database } = useFirebase()
    const { user } = storeToRefs(useUsersStore())

    const messages = ref<ChatMessage[]>([])
    const typingUsers = ref<TypingStatus[]>([])
    const isLoading = ref(false)

    // Subscribe to real-time messages for a channel
    const subscribeToMessages = (roleplayId: string, channelId: string) => {
        if (!user.value)
            return

        const messagesRef = dbRef(database, `chats/${roleplayId}/${channelId}/messages`)

        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                const messageList: ChatMessage[] = []
                Object.keys(data).forEach((key) => {
                    messageList.push({
                        id: key,
                        ...data[key],
                    })
                })
                // Sort by timestamp
                messages.value = messageList.sort((a, b) => a.timestamp - b.timestamp)
            }
            else {
                messages.value = []
            }
        })

        // Subscribe to typing indicators
        const typingRef = dbRef(database, `chats/${roleplayId}/${channelId}/typing`)
        onValue(typingRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                const typingList: TypingStatus[] = []
                Object.keys(data).forEach((key) => {
                    if (data[key].isTyping && Date.now() - data[key].timestamp < 5000) {
                        typingList.push({
                            userId: key,
                            ...data[key],
                        })
                    }
                })
                typingUsers.value = typingList
            }
            else {
                typingUsers.value = []
            }
        })

        // Return cleanup function
        return () => {
            off(messagesRef)
            off(typingRef)
        }
    }

    // Send a message
    const sendMessage = async (content: string, roleplayId: string, channelId: string) => {
        if (!user.value || !content.trim())
            return

        const messagesRef = dbRef(database, `chats/${roleplayId}/${channelId}/messages`)
        const newMessageRef = push(messagesRef)

        const message: Omit<ChatMessage, 'id'> = {
            content: content.trim(),
            userId: user.value.id,
            username: user.value.username,
            avatar: user.value.avatar,
            timestamp: Date.now(),
            channelId,
            roleplayId,
        }

        await set(newMessageRef, message)

        // Store message metadata in DataConnect for persistence
        try {
            await createMessage({
                content: content.trim(),
                channelId,
                roleplayId,
                userId: user.value.id,
            })
        }
        catch (error) {
            console.error('Failed to persist message to DataConnect:', error)
            // Continue even if DataConnect fails - real-time functionality still works
        }
    }

    // Set typing status
    const setTypingStatus = (isTyping: boolean, roleplayId: string, channelId: string) => {
        if (!user.value)
            return

        const typingRef = dbRef(database, `chats/${roleplayId}/${channelId}/typing/${user.value.id}`)

        if (isTyping) {
            set(typingRef, {
                userId: user.value.id,
                username: user.value.username,
                avatar: user.value.avatar,
                isTyping: true,
                timestamp: Date.now(),
            })
        }
        else {
            set(typingRef, null)
        }
    }

    // Load message history from DataConnect (for persistence)
    const loadMessageHistory = async (roleplayId: string, channelId: string, _limit = 50) => {
        try {
            const { data } = await getMessages({
                channelId,
                limit: _limit,
                offset: 0,
            })

            if (data.messages) {
                // Convert DataConnect messages to chat format
                const historyMessages: ChatMessage[] = data.messages.map(msg => ({
                    id: msg.id,
                    content: msg.content,
                    userId: msg.user.id,
                    username: msg.user.username,
                    avatar: msg.user.avatar,
                    timestamp: new Date(msg.createdAt).getTime(),
                    channelId: msg.channelId,
                    roleplayId: msg.roleplayId,
                }))

                // Merge with existing real-time messages
                messages.value = [...historyMessages, ...messages.value]
            }
        }
        catch (error) {
            console.error('Failed to load message history:', error)
        }
    }

    // Mark messages as read
    const markAsRead = (roleplayId: string, channelId: string) => {
        if (!user.value)
            return

        const readRef = dbRef(database, `chats/${roleplayId}/${channelId}/read/${user.value.id}`)
        set(readRef, {
            timestamp: Date.now(),
            userId: user.value.id,
        })
    }

    // Get online users for a roleplay
    const getOnlineUsers = (roleplayId: string) => {
        const onlineRef = dbRef(database, `presence/${roleplayId}`)

        onValue(onlineRef, (snapshot) => {
            const _data = snapshot.val()
            // Handle online users data
        })

        return () => off(onlineRef)
    }

    // Set user presence
    const setPresence = (roleplayId: string, isOnline: boolean) => {
        if (!user.value)
            return

        const presenceRef = dbRef(database, `presence/${roleplayId}/${user.value.id}`)

        if (isOnline) {
            set(presenceRef, {
                userId: user.value.id,
                username: user.value.username,
                avatar: user.value.avatar,
                lastSeen: serverTimestamp(),
                isOnline: true,
            })
        }
        else {
            set(presenceRef, {
                userId: user.value.id,
                username: user.value.username,
                avatar: user.value.avatar,
                lastSeen: serverTimestamp(),
                isOnline: false,
            })
        }
    }

    return {
        messages,
        typingUsers,
        isLoading,
        subscribeToMessages,
        sendMessage,
        setTypingStatus,
        loadMessageHistory,
        markAsRead,
        getOnlineUsers,
        setPresence,
    }
}
