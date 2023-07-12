<template>
    <AdminLayout>
        <div class="flex justify-end mb-4">
            <RouterLink to="/admin/RP/nouveau" class="btn btn-primary">
                <PlusSmallIcon class="w-4 h-4" />
                Nouveau RP
            </RouterLink>
        </div>
        <div class="card w-96 bg-base-200 shadow-xl">
            <div class="card-body">
                <h2 class="card-title">Card title!</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <div class="card-actions justify-end">
                    <button class="btn btn-primary">Buy Now</button>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup lang="ts">
import { PlusSmallIcon } from '@heroicons/vue/24/solid'
useHead({
    title: 'Administration'
})


</script>