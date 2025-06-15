import type { RouteRecordRaw } from 'vue-router'
import roleplays from './roleplays'

const routes: RouteRecordRaw[] = [
    {
        path: '/profil',
        name: 'user-profile',
        component: () => import('@/views/user/UserNav.vue'),
        redirect: { name: 'user-profile-informations' },
        meta: {
            title: 'Profil',
        },
        children: [
            {
                path: 'informations-personnelles',
                name: 'user-profile-informations',
                component: () => import('@/views/user/Profile.vue'),
                meta: {
                    title: 'Informations personnelles',
                },
            },
            {
                path: 'mes-personnages',
                name: 'user-characters',
                component: () => import('@/views/user/CharacterTemplates.vue'),
                meta: {
                    title: 'Mes personnages',
                },
            },
            ...roleplays,
        ],
    },
    {
        path: '/user/:id',
        name: 'user-show',
        component: () => import('@/views/user/Show.vue'),
    },
]

export default routes
