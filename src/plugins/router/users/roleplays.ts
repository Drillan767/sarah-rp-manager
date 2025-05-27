import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/mes-roleplays',
        component: () => import('@/views/user/roleplays/RoleplayNav.vue'),
        children: [
            {
                path: '',
                name: 'user-roleplays',
                component: () => import('@/views/user/roleplays/Index.vue'),
                meta: {
                    title: 'Mes roleplays',
                },
            },
            {
                path: 'nouveau',
                name: 'user-roleplays-create',
                component: () => import('@/views/user/roleplays/Create.vue'),
                meta: {
                    title: 'Nouveau roleplay',
                },
            },

        ],
    },
]

export default routes
