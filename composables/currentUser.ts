export function useCurrentUser() {
    return useState('user', () => ({
        username: '',
        image_url: 'https://sarah-rp-manager.vercel.app/default-avatar.webp',
    }))
}
