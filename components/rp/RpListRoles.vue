<script lang="ts" setup>
defineProps<{ roles: any[] }>()
</script>

<template>
    <div>
        <ul>
            <li
                v-for="(role, i) in roles"
                :key="i"
            >
                {{ role }}
            </li>
        </ul>
    </div>
</template>
