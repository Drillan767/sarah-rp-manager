# Real-Time Chat System

## Overview

This project implements a real-time chat system using **Firebase Realtime Database** for real-time messaging and **DataConnect (PostgreSQL)** for persistent storage. This hybrid approach provides the best of both worlds: instant real-time communication and reliable data persistence.

## Architecture

### Data Storage Strategy

#### Firebase Realtime Database
- **Purpose**: Real-time messaging, typing indicators, presence, read receipts
- **Structure**:
  ```
  chats/
    {roleplayId}/
      {channelId}/
        messages/
          {messageId}/
            content: string
            userId: string
            username: string
            avatar: string
            timestamp: number
            channelId: string
            roleplayId: string
        typing/
          {userId}/
            userId: string
            username: string
            avatar: string
            isTyping: boolean
            timestamp: number
        read/
          {userId}/
            timestamp: number
            userId: string
  presence/
    {roleplayId}/
      {userId}/
        userId: string
        username: string
        avatar: string
        lastSeen: timestamp
        isOnline: boolean
  ```

#### DataConnect (PostgreSQL)
- **Purpose**: Persistent message storage, user data, roleplay metadata
- **Tables**: `messages`, `users`, `roleplays`, `channels`, etc.

### Why Both Databases?

1. **Realtime Database**:
   - Instant message delivery
   - Typing indicators
   - Online presence
   - Real-time read receipts
   - Offline support with sync

2. **DataConnect (PostgreSQL)**:
   - Message history persistence
   - Complex queries and relationships
   - Data integrity and ACID compliance
   - Backup and recovery
   - Analytics and reporting

## Features

### ✅ Implemented
- Real-time messaging
- Typing indicators
- Message persistence
- User presence (online/offline)
- Auto-scroll to latest messages
- Message history loading
- Responsive UI with Vuetify 3
- Security rules for data access

### 🚧 Planned
- Message editing and deletion
- File attachments
- Message reactions
- Read receipts
- Message search
- Channel management
- User mentions (@username)
- Message threading

## Usage

### Basic Chat Component

```vue
<script setup>
import useChat from '@/composables/chat'

const { messages, sendMessage, subscribeToMessages } = useChat()
</script>

<template>
    <VContainer fluid class="pa-0 h-100">
        <!-- Messages display -->
        <div ref="messagesContainer" class="messages-area">
            <div v-for="message in messages" :key="message.id">
                <!-- Message content -->
            </div>
        </div>

        <!-- Message input -->
        <VForm @submit.prevent="handleSendMessage">
            <VTextField v-model="newMessage" />
            <VBtn type="submit">
                Send
            </VBtn>
        </VForm>
    </VContainer>
</template>
```

### Chat Composable

```typescript
import useChat from '@/composables/chat'

const {
    messages, // Reactive messages array
    typingUsers, // Users currently typing
    isLoading, // Loading state
    subscribeToMessages, // Subscribe to real-time messages
    sendMessage, // Send a new message
    setTypingStatus, // Set typing indicator
    loadMessageHistory, // Load historical messages
    markAsRead, // Mark messages as read
    setPresence, // Set user presence
} = useChat()
```

## Security

### Realtime Database Rules
- Authentication required for all operations
- Users can only write their own typing status and presence
- Message validation ensures required fields
- Channel-based access control

### DataConnect Security
- User-level authentication
- Row-level security through GraphQL directives
- Input validation and sanitization

## Performance Considerations

### Realtime Database
- **Optimization**: Limit message history in real-time (last 100 messages)
- **Pagination**: Load older messages on demand
- **Cleanup**: Implement message archiving for old channels

### DataConnect
- **Indexing**: Proper indexes on frequently queried fields
- **Pagination**: Efficient message history loading
- **Caching**: Consider Redis for frequently accessed data

## Deployment

### Prerequisites
1. Firebase project with Realtime Database enabled
2. DataConnect instance configured
3. Security rules deployed

### Steps
1. Deploy DataConnect schema:
   ```bash
   firebase deploy --only dataconnect
   ```

2. Deploy database rules:
   ```bash
   firebase deploy --only database
   ```

3. Deploy functions (if using):
   ```bash
   firebase deploy --only functions
   ```

## Monitoring

### Key Metrics to Track
- Message delivery latency
- Database read/write operations
- Concurrent users per channel
- Error rates for message persistence
- User engagement (messages per session)

### Firebase Console
- Realtime Database usage and performance
- Authentication events
- Function execution logs

## Troubleshooting

### Common Issues

1. **Messages not appearing in real-time**
   - Check Firebase connection
   - Verify security rules
   - Check authentication state

2. **Message history not loading**
   - Verify DataConnect connection
   - Check GraphQL query permissions
   - Review error logs

3. **Typing indicators not working**
   - Check Realtime Database rules
   - Verify user authentication
   - Check network connectivity

### Debug Mode
Enable debug logging in development:
```typescript
// In firebase.ts
if (import.meta.env.DEV) {
    // Enable debug logging
}
```

## Future Enhancements

### Advanced Features
- **Message Encryption**: End-to-end encryption for sensitive conversations
- **Voice Messages**: Audio message support
- **Video Calls**: Integrated video chat
- **Bots**: Automated responses and moderation
- **Analytics**: Message analytics and insights

### Scalability
- **Sharding**: Distribute data across multiple databases
- **CDN**: Global message delivery optimization
- **Microservices**: Separate chat service architecture
- **Load Balancing**: Handle high concurrent user loads

## Contributing

When adding new chat features:
1. Update both Realtime Database and DataConnect schemas
2. Add appropriate security rules
3. Update TypeScript interfaces
4. Add comprehensive tests
5. Update documentation

## License

This chat system is part of the Sarah RP Manager project.
