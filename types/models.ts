export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface SpecificDate {
    isSpecific: true
    begin: string
    end: string
}

export interface CurrentUser {
    id: string
    handle: string
    username: string
    avatar: string
}

export interface GenericDate {
    isSpecific: false
    begin: {
        day: string
        hour: string
    }
    end: {
        day: string
        hour: string
    }
}

export interface Availability {
    weekdays: boolean
    weekends: boolean
    available: (SpecificDate | GenericDate)[]
    unavailable: SpecificDate[]
}

export interface CreatedRole {
    name: string
    max_users: number
    description: string
    roleplay_id: string
    free: boolean
}

export type Role = CreatedRole & {
    id: number
}

export interface Channel {
    id: string
    name: string
    roleplay_id: string
    private: boolean
    allowed_roles: any
    is_default: boolean
}

export interface Character {
    id: number
    name: string
    user_id: number
    status: number
    illustration: string
    description: string
    user: {
        id: number
        username: string
    } | null
}

export type RoleSettings = Role & {
    characters: Character[]
}

export interface Roleplay {
    id: string
    title: string
    description: string
    message_board: string
    start_date: string | null
    illustration: string
    user_id: string
    roles: Role[]
    created_at: string
}

export interface DataTableHeader {
    title: string
    align?: 'start' | 'center' | 'end'
    sortable?: boolean
    width?: string | number
    key?: string
}
