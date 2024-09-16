import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js'
import type {
    RealtimeChannel,
    RealtimePostgresDeletePayload,
    RealtimePostgresInsertPayload,
    RealtimePostgresUpdatePayload,
} from '@supabase/supabase-js'
import type { CurrentUser, OnlineUser } from '@/types/models'
import type { Database, Tables } from '~/types/supabase'

type Character = Tables<'characters'>

type Channel = Tables<'channels'> & {
    channels_users: Tables<'channels_users'>[]
}

type Message = Tables<'messages'> & {
    user: CurrentUser
}

export default function useRealtimeMessages(rpId: string) {
    const supabase = useSupabaseClient<Database>()
    const user = useSupabaseUser()

    const currentUser = useState<CurrentUser | undefined>('current-user')

    const onlineUsers = ref<OnlineUser[]>([])
    const characters = ref<Omit<Character, 'user'>[]>([])
    const allChannels = ref<Channel[]>([])
    const messages = ref<Message[]>([])

    const publicChannels = computed(() => allChannels.value.filter(c => c.internal === true))
    const privateChannels = computed(() => allChannels.value.filter((c) => {
        const authorizedUsers = c.channels_users.map(cu => cu.user_id)
        return c.internal === false && authorizedUsers.includes(currentUser.value?.id ?? '')
    }))
    const allUsers = computed<CurrentUser[]>(() => {
        const otherUsers = onlineUsers.value.map(o => o.user)

        if (currentUser.value)
            otherUsers.push(currentUser.value)

        return otherUsers
    })

    let heartbeatInterval: number | null = null

    const dbRealTime = ref<RealtimeChannel>(supabase.channel(`db-${rpId}`))
    const presence = ref<RealtimeChannel>(supabase.channel(`presence-${rpId}`, {
        config: {
            presence: {
                key: currentUser.value?.id,
            },
        },
    }))

    /* === Events listeners === */

    async function handleMessageInsert(payload: RealtimePostgresInsertPayload<Tables<'messages'>>) {
        const found = messages.value.find(m => m.id === payload.new.id)

        if (found)
            return
        messages.value.push({
            ...payload.new,
            user: allUsers.value.find(u => u.id === payload.new.user_id)!,
        })
    }

    async function handleChannelInsert(payload: RealtimePostgresInsertPayload<Tables<'channels'>>) {
        const { data } = await supabase
            .from('channels')
            .select('*, channels_users(*)')
            .eq('id', payload.new.id)
            .single()

        if (!data)
            return

        allChannels.value.push(data)
    }

    async function handleChannelUpdate(payload: RealtimePostgresUpdatePayload<Channel>) {
        const index = allChannels.value.findIndex(c => c.id === payload.new.id)
        allChannels.value[index] = payload.new
    }

    async function handleChannelDeletion(payload: RealtimePostgresDeletePayload<Tables<'channels'>>) {
        allChannels.value = allChannels.value.filter(c => c.id !== payload.old.id)
    }

    /* === End events listeners === */

    async function retrieveCurrentUser() {
        if (user.value) {
            const { user_metadata: twitter } = user.value
            currentUser.value = {
                id: user.value.id,
                handle: twitter.user_name,
                username: twitter.name,
                avatar: twitter.picture,
            }
        }
        else {
            currentUser.value = undefined
        }
    }

    async function setupPresence() {
        presence.value
            .on('presence', { event: 'sync' }, updateOnlineUsers)
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await presence.value.track({
                        user: currentUser.value,
                        online_at: new Date().toISOString(),
                        characters: characters.value,
                    })
                }
                else if (status === 'CHANNEL_ERROR') {
                    // Handle reconnection
                    await setupPresence()
                }
            })
    }

    async function loadUserCharacters() {
        if (!currentUser.value)
            return

        const { data } = await supabase
            .from('characters')
            .select('*')
            .eq('user_id', currentUser.value?.id)

        if (data)
            characters.value = data

        await presence.value.track({
            user: currentUser.value,
            online_at: new Date().toISOString(),
            characters: characters.value,
        })
    }

    function updateOnlineUsers() {
        const presences = Object.values(presence.value.presenceState())

        const result: OnlineUser[] = []

        for (const presence of presences) {
            const onlineUser: OnlineUser = presence[0] as any as OnlineUser

            if (onlineUser.user.handle !== currentUser.value?.handle)
                result.push(onlineUser)
        }

        onlineUsers.value = result
    }

    // Initial fetch for the channels.
    async function loadChannels() {
        const { data } = await supabase
            .from('channels')
            .select('*, channels_users(*)')
            .eq('roleplay_id', rpId)

        if (data) {
            allChannels.value = data
        }
    }

    async function loadMessages() {
        const { data } = await supabase
            .from('messages')
            .select(`
                *,
                user:users!inner(id, handle, username, avatar)
            `)
            .in('channel_id', allChannels.value.map(c => c.id))

        if (data)
            messages.value = data
    }

    function setupDatabaseListeners() {
        dbRealTime.value
            .on('postgres_changes', {
                schema: 'public',
                table: 'messages',
                event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT,
            }, handleMessageInsert)
            .on('postgres_changes', {
                schema: 'public',
                table: 'channels',
                event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT,
                filter: `roleplay_id=eq.${rpId}`,
            }, handleChannelInsert)
            .on('postgres_changes', {
                schema: 'public',
                table: 'channels',
                event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE,
                filter: `roleplay_id=eq.${rpId}`,
            }, handleChannelUpdate)
            .on('postgres_changes', {
                schema: 'public',
                table: 'channels',
                event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE,
                filter: `roleplay_id=eq.${rpId}`,
            }, handleChannelDeletion)
            .subscribe()
    }

    function startHeartbeat() {
        heartbeatInterval = window.setInterval(async () => {
            await presence.value.track({
                user: currentUser.value,
                online_at: new Date().toISOString(),
            })
        }, 15000)
    }

    function stopHeartbeat() {
        if (heartbeatInterval) {
            clearInterval(heartbeatInterval)
            heartbeatInterval = null
        }
    }

    async function loadAll() {
        if (dbRealTime.value.state === 'joined' || presence.value.state === 'joined') {
            console.warn('Channels already subscribed. Skipping setup.')
            return
        }

        retrieveCurrentUser()
        await setupPresence()
        await loadUserCharacters()
        await loadChannels()
        setupDatabaseListeners()
        await loadMessages()
        startHeartbeat()
    }

    function disconnect() {
        dbRealTime.value.unsubscribe()
        presence.value.unsubscribe()
        supabase.removeAllChannels()
        stopHeartbeat()
    }

    return {
        loadAll,
        onlineUsers,
        publicChannels,
        privateChannels,
        messages,
        disconnect,
    }
}
