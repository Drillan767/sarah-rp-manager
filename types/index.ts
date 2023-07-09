export type DayOfWeek = "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi" | "Samedi" | "Dimanche"

export type User = {
    image_url: string,
    description: string,
    username: string,
    is_admin: boolean,
    session_id: string,
    email: string,
    availability: Record<DayOfWeek, string[]>,
}
