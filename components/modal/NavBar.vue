<template>
    <div class="navbar bg-base-300">
        <div class="flex-1">
            <RouterLink to="/" class="btn btn-ghost normal-case text-xl">
                <img class="w-10 rounded-full" src="/sarah.jpg" />
                <span>
                    Le Jardin de Sarah
                </span>
            </RouterLink>
        </div>
        <div class="flex-none">
            <span class="mr-2">{{ user.username }}</span>
            <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                    <div class="w-10 rounded-full">
                        <img src="/default-avatar.webp" />
                    </div>
                </label>
                <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
                    <li>
                        <RouterLink to="/profil">
                            <UserCircleIcon class="h-4 w-4" />
                            Profil
                        </RouterLink>
                    </li>
                    <li v-if="user.is_admin">
                        <RouterLink to="/admin">
                            <LockClosedIcon class="h-4 w-4" />
                            Administration
                        </RouterLink>
                    </li>
                    <li>
                        <span @click="logout()" class="cursor-pointer">
                            <ArrowRightOnRectangleIcon class="h-4 w-4" />
                            Déconnexion
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowRightOnRectangleIcon, UserCircleIcon, LockClosedIcon } from '@heroicons/vue/24/solid'
import { useUserStore } from '@/stores/users'

const userStore = useUserStore()

const { logout, initSession, user } = userStore

onMounted(() => initSession())

</script>