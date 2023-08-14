export type DayOfWeek = 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi' | 'Dimanche'

export interface SpecificDate {
    isSpecific: true
    begin: string
    end: string
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
    unavailble: SpecificDate[]
}

export interface ProfileFormType {
    email: string
    username: string
    description: string
    availability: any
}

export interface User {
    image_url: string
    description: string
    username: string
    is_sarah: boolean
    session_id: string
    email: string
    availability: any
}

export interface Roleplay {
    id: string
    title: string
    illustration: string
    start_date: string | null
    description: string
    totalUsers: number
    nbCurrentUsers: number
}

export interface RoleplayDetail {
    id: string
    title: string
    illustration: string
    message_board: null | string
    start_date: null | string
    created_at: string | null
    description: string
    channels: {
        name: string
        private: boolean
    }[]
    roles: {
        id: number
        roleplay_id: string
        name: string
        max_users: number
    }[]
}
