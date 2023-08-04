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
            <span v-if="user.username" class="mr-2">{{ user.username }}</span>

            <div v-if="user.username" class="dropdown dropdown-end z-20">
                <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                    <div class="w-10 rounded-full">
                        <img :src="user.image_url" />
                    </div>
                </label>
                <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
                    <li>
                        <RouterLink to="/profil">
                            <UserCircleIcon class="h-4 w-4" />
                            Profil
                        </RouterLink>
                    </li>
                    <ClientOnly>
                        <li v-if="user.is_sarah">
                            <RouterLink to="/admin">
                                <LockClosedIcon class="h-4 w-4" />
                                Administration
                            </RouterLink>
                        </li>
                    </ClientOnly>

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
import { storeToRefs } from 'pinia';
import { ArrowRightOnRectangleIcon, UserCircleIcon, LockClosedIcon } from '@heroicons/vue/24/solid'
import { useUserStore } from '@/stores/users'

const userStore = useUserStore()

const { logout } = userStore
const { user } = storeToRefs(userStore)

</script>