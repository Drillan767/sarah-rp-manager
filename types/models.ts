
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

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
    unavailable: SpecificDate[]
}

export interface CreatedRole {
    name: string,
    max_users: number,
    description: string,
    roleplay_id: string,
}

export type Role = CreatedRole & {
    id: number,
}

export interface Channel {
    id: number,
    name: string,
    roleplay_id: string,
    private: boolean,
    allowed_roles: any,
}

export interface Character {
    id: number,
    name: string,
    role_id: number,
    user_id: number,
    status: number,
    illustration: string,
    description: string,
    user: {
        id: number,
        username: string,
    }
}

export type RoleSettings = Role & {
    characters: Character[]
}

export interface Roleplay {
    id: string,
    title: string,
    description: string,
    message_board: string,
    start_date: string | null,
    illustration: string,
    public: boolean,
    user_id: number,
    roles: Role[],
    created_at: string,
}

export interface DataTableHeader {
    title: string,
    align?: 'start' | 'center' | 'end',
    sortable?: boolean,
    width?: string | number,
    key?: string,
}