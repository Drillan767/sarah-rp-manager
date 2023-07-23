<template>
    <div class="container-fluid">
        <div class="flex justify-between">
            <h1 class="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                Roleplays disponibles
            </h1>
            <ClientOnly>
                <RouterLink v-if="user.is_sarah" to="/roleplay/nouveau" class="btn btn-primary">
                    Nouveau
                </RouterLink>
            </ClientOnly>
        </div>

        <div class="rp-list">
            <div v-for="(rp, i) in rpList" class="card w-96 bg-base-100 shadow-xl image-full" :key="i">
                <figure>
                    <img :src="rp.illustration" alt="Shoes" />
                </figure>
                <div class="card-body">
                    <h2 class="card-title">{{ rp.title }}</h2>
                    <p>{{ truncate(rp.description) }}</p>
                    <p><b>Date prévue :</b> {{ rp.start_date ? dayjs(rp.start_date).from(dayjs()) : 'N/A' }}</p>
                    <div class="card-actions justify-end">
                        <RouterLink :to="`/roleplay/${rp.id}`" class="btn btn-info">Voir</RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Database } from 'types/supabase'
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/users';

type Roleplay = {
    id: string,
    title: string,
    start_date: string | null,
    illustration: string,
    description: string,
}

const dayjs = useDayjs()
const supabase = useSupabaseClient<Database>()

const userStore = useUserStore()

const { user } = storeToRefs(userStore)
const rpList = ref<Roleplay[]>([])

const { logout } = userStore

//onMounted(() => logout())

const { data } = await supabase
    .from('roleplays')
    .select('id, title, illustration, description, start_date')
    .eq('public', true)

if (data) {
    rpList.value = data;
}

useHead({
    title: 'Accueil'
})

const truncate = (str: string) => (str.length > 100) ? str.slice(0, 99) + "..." : str

</script>

<style scoped lang="scss">
.rp-list {
    @apply grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 grid-rows-1 gap-2;
}
</style>