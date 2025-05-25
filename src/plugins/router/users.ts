import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/profil',
        name: 'user-profile',
        component: () => import('@/views/user/Profile.vue'),
        meta: {
            title: 'Profil',
        },
    },
    {
        path: '/mes-roleplays',
        name: 'user-roleplays',
        component: () => import('@/views/user/Roleplays.vue'),
        meta: {
            title: 'Mes roleplays',
        },
    },
    {
        path: '/mes-personnages',
        name: 'user-characters',
        component: () => import('@/views/user/Characters.vue'),
        meta: {
            title: 'Mes personnages',
        },
    },
]

export default routes
