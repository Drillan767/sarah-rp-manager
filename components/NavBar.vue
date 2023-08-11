<script setup lang="ts">
import { ArrowRightOnRectangleIcon, LockClosedIcon, UserCircleIcon } from '@heroicons/vue/24/solid'
import type { Database } from '@/types/supabase'

const router = useRouter()
const user = useSupabaseUser()
const client = useSupabaseClient<Database>()

const userData = ref<any>(null)

async function logout() {
    await client.auth.signOut()
    localStorage.removeItem('user')
    router.push('/connexion')
}

onMounted(async () => {
    if (user.value) {
        const { data } = await client
            .from('users')
            .select('*')
            .eq('session_id', user.value.id)
            .single()

        if (data)
            userData.value = data
    }
})
</script>

<template>
    <div class="navbar bg-base-300">
        <div class="flex-1">
            <RouterLink
                to="/"
                class="btn btn-ghost normal-case text-xl"
            >
                <img
                    class="w-10 rounded-full"
                    src="/sarah.jpg"
                >
                <span>
                    Le Jardin de Sarah
                </span>
            </RouterLink>
        </div>
        <div
            v-if="userData"
            class="flex-none"
        >
            <span
                v-if="userData.username"
                class="mr-2"
            >{{ userData.username }}</span>

            <div
                v-if="userData.username"
                class="dropdown dropdown-end z-20"
            >
                <label
                    tabindex="0"
                    class="btn btn-ghost btn-circle avatar"
                >
                    <div class="w-10 rounded-full">
                        <img :src="userData.image_url">
                    </div>
                </label>
                <ul
                    tabindex="0"
                    class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52"
                >
                    <li>
                        <RouterLink to="/profil">
                            <UserCircleIcon class="h-4 w-4" />
                            Profil
                        </RouterLink>
                    </li>
                    <li v-if="userData.is_sarah">
                        <RouterLink to="/admin">
                            <LockClosedIcon class="h-4 w-4" />
                            Administration
                        </RouterLink>
                    </li>

                    <li>
                        <span
                            class="cursor-pointer"
                            @click="logout()"
                        >
                            <ArrowRightOnRectangleIcon class="h-4 w-4" />
                            Déconnexion
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
