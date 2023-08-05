<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/users'
import { useRoleplayStore } from '@/stores/roleplays'
import RpDescriptionRoles from '@/components/rp/rpDescriptionRoles.vue'
import RpChannels from '@/components/rp/rpChannels.vue'
import RpUserList from '@/components/rp/rpUserList.vue'

definePageMeta({
    validate: async (route) => {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(route.params.id.toString())
    },
})

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const roleplayStore = useRoleplayStore()
const { query, params } = route

const { loadSingleRP } = roleplayStore
const { roleplay } = storeToRefs(roleplayStore)
const { user } = storeToRefs(userStore)

const created = ref(false)
const updated = ref(false)
const currentTab = ref('description')

if (Object.prototype.hasOwnProperty.call(query, 'created'))
    created.value = true
if (Object.prototype.hasOwnProperty.call(query, 'updated'))
    updated.value = true

const { id } = params

onMounted(async () => loadSingleRP(id.toString()))

useHead({
    title: roleplay.value.title,
})
</script>

<template>
    <div>
        <div
            v-if="created || updated"
            class="alert alert-success"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <span v-if="created">Le roleplay a été créé avec succès !</span>
            <span v-if="updated">Le roleplay a été mis à jour !</span>
        </div>

        <div class="flex justify-between my-4">
            <button
                class="btn btn-primary"
                @click="router.back()"
            >
                Retour
            </button>
            <ClientOnly>
                <RouterLink
                    v-if="user.is_sarah"
                    :to="`/admin/RP/${id}/modifier`"
                    class="btn btn-secondary"
                >
                    Modifier
                </RouterLink>
            </ClientOnly>
        </div>

        <div
            class="banner"
            :style="`background-image:url(${roleplay.illustration})`"
        />
        <h1 class="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            {{ roleplay.title }}
        </h1>

        <div class="tabs mb-4">
            <button
                class="tab tab-lg tab-bordered"
                :class="{ 'tab-active': currentTab === 'description' }"
                @click="currentTab = 'description'"
            >
                Description
            </button>
            <button
                class="tab tab-lg tab-bordered"
                :class="{ 'tab-active': currentTab === 'userlist' }"
                @click="currentTab = 'userlist'"
            >
                Personnages
            </button>
            <button
                class="tab tab-lg tab-bordered"
                :class="{ 'tab-active': currentTab === 'channels' }"
                @click="currentTab = 'channels'"
            >
                Salons
            </button>
        </div>

        <RpDescriptionRoles
            v-if="currentTab === 'description'"
            :description="roleplay.description"
            :roles="roleplay.roles"
            :editable="user.is_sarah"
        />
        <RpUserList v-if="currentTab === 'userlist'" />
        <RpChannels
            v-if="currentTab === 'channels'"
            :channels="roleplay.channels"
        />
    </div>
</template>

<style scoped lang="scss">
.banner {
    height: 25vh;
    @apply rounded-xl bg-center bg-fixed mb-4;
}
</style>
