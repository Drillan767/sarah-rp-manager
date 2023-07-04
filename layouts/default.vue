<template>
    <!-- Navbar start -->
    <nav id="navbar" class="fixed top-0 z-40 flex w-full flex-row justify-end bg-gray-700 px-4 sm:justify-between">
        <ul class="breadcrumb hidden flex-row items-center py-4 text-lg text-white sm:flex">
            <ClientOnly>
                <li v-for="(link, i) in links">
                    <RouterLink v-if="link.url" :to="link.url" :key="i">
                        {{ link.title }}
                    </RouterLink>
                    <span v-else>
                        {{ link.title }}
                    </span>
                </li>
            </ClientOnly>
        </ul>
        <button @click="showSidebar = !showSidebar" id="btnSidebarToggler" type="button"
            class="py-4 text-2xl text-white hover:text-gray-200">
            <svg id="navClosed" :class="{ 'hidden': showSidebar }" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-8 w-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <svg id="navOpen" :class="{ 'hidden': showSidebar === false }" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-8 w-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </nav>
    <!-- Navbar end -->

    <!-- Sidebar start-->
    <div id="containerSidebar" class="z-40">
        <div class="navbar-menu relative z-40">
            <nav id="sidebar" :class="{ 'show': showSidebar }"
                class="fixed left-0 bottom-0 flex w-3/4 -translate-x-full flex-col overflow-y-auto bg-gray-700 pt-6 pb-8 sm:max-w-xs lg:w-80">
                <!-- one category / navigation group -->
                <div class="px-4 pb-6">
                    <h3 class="mb-2 text-xs font-medium uppercase text-gray-500">
                        Main
                    </h3>
                    <ul class="mb-8 text-sm font-medium">
                        {{ }}
                        <li>
                            <a class="active flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-gray-600"
                                href="#homepage">
                                <span class="select-none">Homepage</span>
                            </a>
                        </li>
                        <li>
                            <a class="flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-gray-600"
                                href="#link1">
                                <span class="select-none">link1</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <!-- navigation group end-->

                <!-- example copies start -->
                <div class="px-4 pb-6">
                    <h3 class="mb-2 text-xs font-medium uppercase text-gray-500">
                        Legal
                    </h3>
                    <ul class="mb-8 text-sm font-medium">
                        <li>
                            <a class="flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-gray-600" href="#tc">
                                <span class="select-none">Terms and Condition</span>
                            </a>
                        </li>
                        <li>
                            <a class="flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-gray-600"
                                href="#privacy">
                                <span class="select-none">Privacy policy</span>
                            </a>
                        </li>
                        <li>
                            <a class="flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-gray-600"
                                href="#imprint">
                                <span class="select-none">Imprint</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <div class="px-4 pb-6">
                    <h3 class="mb-2 text-xs font-medium uppercase text-gray-500">
                        Compte
                    </h3>
                    <ul class="mb-8 text-sm font-medium">
                        <li>
                            <RouterLink to="/profil"
                                class="flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-gray-600">
                                Profil
                            </RouterLink>
                        </li>
                        <li>
                            <span
                                class="flex items-center rounded cursor-pointer py-3 pl-3 pr-4 text-gray-50 hover:bg-gray-600"
                                @click="logout()">
                                Déconnexion
                            </span>
                        </li>
                    </ul>
                </div>
                <!-- example copies end -->
            </nav>
        </div>
        <div class="mx-auto lg:ml-80"></div>
    </div>
    <!-- Sidebar end -->

    <main>
        <slot />
    </main>
</template>

<script setup>
import { useBreadcrumbStore } from '@/stores/breadcrumb';
// import { useUserStore } from '@/stores/users';
import { storeToRefs } from 'pinia';

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


const showSidebar = ref(false)

</script>

<style scoped lang="scss">
.breadcrumb {
    li {
        span {
            opacity: 60%;
        }

        &+li::before {
            content: "\276F";
            padding-left: 8px;
            padding-right: 4px;
            color: inherit;
        }
    }
}

#sidebar {
    top: 64px;
    -webkit-transition: all 300ms cubic-bezier(0, 0.77, 0.58, 1);
    transition: all 300ms cubic-bezier(0, 0.77, 0.58, 1);

    &.show {
        transform: translateX(0);
    }


}

#sidebar.show {
    ul li a.active {
        background: #1f2937;
        background-color: #1f2937;
    }
}

main {
    @apply pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900 min-h-screen;
}
</style>