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
]

export default routes
