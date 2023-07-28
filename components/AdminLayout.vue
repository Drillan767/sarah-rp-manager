<script setup lang="ts">
import {
    BookmarkSquareIcon,
    ChatBubbleBottomCenterTextIcon,
    UsersIcon,
} from '@heroicons/vue/24/solid'
</script>

<template>
    <div class="drawer lg:drawer-open">
        <input
            id="my-drawer-2"
            type="checkbox"
            class="drawer-toggle"
        >
        <div class="drawer-content bg-base-100">
            <!-- Page content here -->
            <label
                for="my-drawer-2"
                class="btn btn-primary drawer-button lg:hidden"
            >Open drawer</label>

            <div class="m-4">
                <slot />
            </div>
        </div>
        <div class="drawer-side bg-base-300">
            <label
                for="my-drawer-2"
                class="drawer-overlay"
            />
            <ul class="menu p-4 w-60 h-full bg-base-200 text-base-content">
                <!-- Sidebar content here -->
                <li>
                    <RouterLink to="/admin">
                        <BookmarkSquareIcon class="w-4 h-4" />
                        Roleplays
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/admin/utilisateurs">
                        <UsersIcon class="w-4 h-4" />
                        Utilisateurs
                    </RouterLink>
                </li>
                <li>
                    <a>
                        <ChatBubbleBottomCenterTextIcon class="w-4 h-4" />
                        Salons de discussion
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.router-link-exact-active {
    @apply bg-base-300;
}
</style>
