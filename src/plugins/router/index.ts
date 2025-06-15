import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/Index.vue'
import { authGuard } from './guards'
import roleplays from './roleplays'
import users from './users'

const routes = [
    {
        path: '/',
        component: IndexView,
        name: 'home',
        meta: {
            title: 'Accueil',
        },
    },
    ...users,
    ...roleplays,
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Add navigation guard
router.beforeEach(authGuard)

export default router
