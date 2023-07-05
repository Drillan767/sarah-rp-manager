<template>
<!--     <nav class="bg-white border-gray-200 dark:bg-gray-900">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <RouterLink to="/" class="flex items-center">
                <img src="/sarah.jpg" class="h-8 mr-3 rounded-full" alt="Logo" />
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                    Le Jardin de Sarah
                </span>
            </RouterLink>
            <div class="flex items-center md:order-2">
                <button type="button"
                    class="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown"
                    data-dropdown-offset-skidding="-65" data-dropdown-placement="bottom">
                    <span class="sr-only">Open user menu</span>
                    <img class="w-8 h-8 rounded-full" src="/default-avatar.webp" alt="user photo">
                </button>
                <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                    id="user-dropdown">
                    <div class="px-4 py-3">
                        <span class="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
                        <span class="block text-sm  text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span>
                    </div>
                    <ul class="py-2 desktop-menu" aria-labelledby="user-menu-button">
                        <li>
                            <a href="#"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</a>
                        </li>
                        <li>
                            <a href="#"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</a>
                        </li>
                        <li>
                            <a href="#"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Earnings</a>
                        </li>
                        <li>
                            <a href="#"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign
                                out</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav> -->

    <NavBar />

    <main class="pt-8 pb-16 lg:pt-16 lg:pb-24 min-h-screen">
        <slot />
    </main>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import NavBar from '@/components/modal/NavBar.vue';
// import { useUserStore } from '@/stores/users';



const router = useRouter()
const userStore = useUserStore()
const { links } = useBreadcrumbStore()

const { logout } = userStore;
const { loggedIn } = storeToRefs(userStore)

watch(loggedIn, (newVal) => {
    if (newVal === false) {
        router.push('/connexion')
    }
})

</script>

<style scoped lang="scss"></style>