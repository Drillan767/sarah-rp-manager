<script setup lang="ts">
import { useTheme } from 'vuetify'
import type { Database } from '~/types/supabase'
import { useCurrentUser } from '~/composables/currentUser'

const { t } = useI18n()
const theme = useTheme()

const supabase = useSupabaseClient<Database>()
const router = useRouter()
const user = useSupabaseUser()
const currentUser = useCurrentUser()

async function logout() {
    await supabase.auth.signOut()
    await router.push('/connexion')
}

function switchTheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

onMounted(async () => {
    if (user.value) {
        const { data } = await supabase
            .from('users')
            .select('username, superadmin, id')
            .eq('session_id', user.value.id)
            .single()

        if (data)
            currentUser.value = data
    }
})
</script>

<template>
    <VAppBar class="px-6">
        <RouterLink to="/">
            <VAvatar
                :tile="true"
                image="/sarah.jpg"
            />
        </RouterLink>
        <VToolbarTitle>
            Le Jardin de Sarah
        </VToolbarTitle>

        <span class="d-none d-sm-inline mr-4">
            {{ currentUser.username }}
        </span>
        <VMenu v-if="currentUser.id !== 0" anchor="bottom end">
            <template #activator="{ props }">
                <VBtn
                    icon
                    v-bind="props"
                >
                    <VAvatar image="/default-avatar.webp" />
                </VBtn>
            </template>
            <VList>
                <VListItem
                    to="/profile"
                    prepend-icon="mdi-account"
                    :title="t('account.self')"
                />
                <VListItem
                    to="/my-roleplays"
                    prepend-icon="mdi-book-open-page-variant-outline"
                    :title="t('pages.roleplays.navlink')"
                />
                <VListItem
                    v-if="currentUser.superadmin"
                    to="/administration"
                    prepend-icon="mdi-security"
                    title="Administration"
                />
                <VDivider />
                <VListItem
                    prepend-icon="mdi-logout"
                    :title="t('account.logout')"
                    @click="logout"
                />
                <VDivider />
                <VListItem
                    :prepend-icon="theme.current.value.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
                    :title="t(theme.current.value.dark ? 'account.light' : 'account.dark')"
                    @click="switchTheme"
                />
            </VList>
        </VMenu>
        <VBtn
            v-else
            to="/login"
            color="primary"
        >
            {{ t('login.action') }}
        </VBtn>
    </VAppBar>
</template>
