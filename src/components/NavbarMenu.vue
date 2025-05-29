<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useDisplay, useTheme } from 'vuetify'
import useUsersStore from '@/stores/users'

defineProps<{ displayUsername: boolean }>()

const { signIn, signOut } = useUsersStore()
const { user } = storeToRefs(useUsersStore())
const router = useRouter()

const { mobile } = useDisplay()
const theme = useTheme()

function logOut() {
    signOut()
    router.push('/')
}

function switchTheme() {
    theme.global.name.value = theme.global.current.value.dark
        ? 'light'
        : 'dark'
}
</script>

<template>
    <template v-if="user">
        <VListItem
            v-if="!mobile && displayUsername"
            :title="user.username"
            :subtitle="user.handle"
            class="text-right"
        />
        <VMenu>
            <template #activator="{ props }">
                <VBtn v-bind="props" icon>
                    <VAvatar :image="user.avatar" />
                </VBtn>
            </template>
            <VList>
                <VListItem
                    v-if="mobile"
                    :title="user.username"
                    :subtitle="`@${user.handle}`"
                    class="text"
                />
                <VDivider v-if="mobile" />
                <VListItem
                    :to="{ name: 'user-profile' }"
                    title="Profil"
                    prepend-icon="mdi-account"
                />
                <VDivider />
                <VListItem
                    :to="{ name: 'user-roleplays' }"
                    title="Mes roleplays"
                    prepend-icon="mdi-book-open-page-variant-outline"
                />
                <VListItem
                    :to="{ name: 'roleplays' }"
                    title="Tous les roleplays"
                    prepend-icon="mdi-bookshelf"
                />
                <VDivider />
                <VListItem
                    title="Déconnexion"
                    prepend-icon="mdi-logout"
                    @click="logOut"
                />
                <VDivider />
                <VListItem
                    :prepend-icon="
                        theme.current.value.dark
                            ? 'mdi-white-balance-sunny'
                            : 'mdi-weather-night'
                    "
                    :title="
                        theme.current.value.dark
                            ? 'Thème clair'
                            : 'Thème sombre'
                    "
                    @click="switchTheme"
                />
            </VList>
        </VMenu>
    </template>
    <VBtn
        v-else
        color="primary"
        @click="signIn"
    >
        Se connecter
    </VBtn>
</template>
