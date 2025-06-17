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
    {
        path: '/roleplays/:id/channels',
        name: 'roleplay-channels',
        component: () => import('@/views/roleplays/channels/Index.vue'),
    },
    {
        path: '/roleplays/:id/channels/:channelId',
        name: 'roleplay-channels-detail',
        component: () => import('@/views/roleplays/channels/Detail.vue'),
    },
]

export default routes
