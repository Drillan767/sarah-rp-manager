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
            <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                    <div class="w-10 rounded-full">
                        <img src="/default-avatar.webp" />
                    </div>
                </label>
                <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li class="border-b border-b-gray-600 pb-2">
                        <span class="block text-sm text-gray-900 dark:text-white">
                            Utilisateur anonyme
                        </span>
                        <span class="block text-sm  text-gray-500 truncate dark:text-gray-400">
                            name@flowbite.com
                        </span>
                    </li>
                    <li>
                        <a class="justify-between">
                            Profile
                            <span class="badge">New</span>
                        </a>
                    </li>
                    <li><a>Settings</a></li>
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
import { storeToRefs } from 'pinia'
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/solid'
import { useUserStore } from '@/stores/users'

const userStore = useUserStore()

const { logout } = userStore

</script>