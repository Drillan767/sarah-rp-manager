export type User = {
    image_url: string,
    description: string,
    username: string,
    is_admin: boolean,
    session_id: string,
    email: string,
    availability: {
        monday: string[],
        tuesday: string[],
        wednesday: string[],
        thursday: string[],
        friday: string[],
        saturday: string[],
        sunday: string[],
    },
}