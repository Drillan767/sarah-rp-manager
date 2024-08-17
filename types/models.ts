import type { Tables } from './supabase'

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

export interface OnlineUser {
    characters: Tables<'characters'>[]
    user: CurrentUser
    online_at: string
}

export type RoleSettings = Role & {
    characters: Tables<'characters'>[]
}

export interface DataTableHeader {
    title: string
    align?: 'start' | 'center' | 'end'
    sortable?: boolean
    width?: string | number
    key?: string
}
