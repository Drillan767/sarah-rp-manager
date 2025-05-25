import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/Index.vue'
import users from './users'

const routes = [
    { path: '/', component: IndexView },
    ...users,
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
