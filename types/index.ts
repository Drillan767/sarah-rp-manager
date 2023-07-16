export type DayOfWeek = "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi" | "Samedi" | "Dimanche"

export type User = {
    image_url: string,
    description: string,
    username: string,
    is_sarah: boolean,
    session_id: string,
    email: string,
    availability: string[],
}

export type Roleplay = {
    id: string,
    title: string,
    illustration: string,
    start_date: string | null,
    description: string,
    totalUsers: number,
    nbCurrentUsers: number,
}

export type RoleplayDetail = {
    id: string,
    title: string,
    illustration: string,
    message_board: null | string,
    start_date:  null | string,
    created_at: string | null,
    description: string,
    channels: {
        name: string,
        private: boolean,
    }[],
    roles: {
        id: number,
        roleplay_id: string,
        name: string,
        max_users: number,
    }[]
}