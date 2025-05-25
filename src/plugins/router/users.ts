import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/profil',
        name: 'user-profile',
        component: () => import('@/views/user/Profile.vue'),
    },
    {
        path: '/mes-roleplays',
        name: 'user-roleplays',
        component: () => import('@/views/user/Roleplays.vue'),
    },
    {
        path: '/mes-personnages',
        name: 'user-characters',
        component: () => import('@/views/user/Characters.vue'),
    },
]

export default routes
