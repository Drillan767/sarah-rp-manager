<script setup lang="ts">
interface Props {
    channels: {
        name: string
        private: boolean
    }[]
}

defineProps<Props>()
</script>

<template>
    <div class="channels">
        <div
            v-for="(channel, i) in channels"
            :key="i"
            class="card w-96 bg-base-200 shadow-xl"
        >
            <div class="card-body">
                <h2 class="card-title">
                    {{ channel.name }}
                </h2>
                <div class="card-actions justify-end">
                    <button class="btn btn-primary">
                        Rejoindre
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.channels {
    @apply flex gap-x-4;
}
</style>
