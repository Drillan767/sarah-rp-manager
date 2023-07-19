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
