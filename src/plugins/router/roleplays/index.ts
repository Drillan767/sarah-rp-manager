import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/roleplays',
        name: 'roleplays',
        component: () => import('@/views/roleplays/Index.vue'),
        meta: {
            title: 'Roleplays',
        },
    },
    {
        path: '/roleplays/:id',
        name: 'roleplay-details',
        component: () => import('@/views/roleplays/Show.vue'),
    },
]

export default routes
