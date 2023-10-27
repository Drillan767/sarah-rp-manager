export function useCurrentUser() {
    return useState('user', () => ({
        id: 0,
        username: '',
        superadmin: false,
    }))
}
