import type { RouteRecordRaw } from 'vue-router'
import roleplays from './roleplays'

const routes: RouteRecordRaw[] = [
    {
        path: '/profil',
        name: 'user-profile',
        component: () => import('@/views/user/Profile.vue'),
        meta: {
            title: 'Profil',
        },
        children: [
            {
                path: 'mes-personnages',
                name: 'user-characters',
                component: () => import('@/views/user/Characters.vue'),
                meta: {
                    title: 'Mes personnages',
                },
            },
        ],
    },
    {
        path: '/user/:id',
        name: 'user-show',
        component: () => import('@/views/user/Show.vue'),
    },
    ...roleplays,
]

export default routes
