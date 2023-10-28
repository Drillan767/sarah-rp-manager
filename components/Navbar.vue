<script setup lang="ts">
import type { Database } from '@/types/supabase'
import { useTheme} from 'vuetify'
import { useCurrentUser } from '@/composables/currentUser'

const { t } = useI18n()
const theme = useTheme()

const supabase = useSupabaseClient<Database>()
const router = useRouter()
const user = useSupabaseUser()
const currentUser = useCurrentUser()

const logout = async() => {
    await supabase.auth.signOut()
    await router.push('/connexion')
}

const switchTheme = () => {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

onMounted(async () => {
    if (user.value) {
        const { data } = await supabase
            .from('users')
            .select('username, superadmin, id')
            .eq('session_id', user.value.id)
            .single()

        if (data) {
            currentUser.value = data
        }
    }
})

</script>

<template>
    <VAppBar class="px-6">
        <VAvatar :tile="true">
            <VImg src="/sarah.jpg" />
        </VAvatar>
        <VToolbarTitle>Le Jardin de Sarah</VToolbarTitle>

        <span class="d-none d-sm-inline mr-4">
            {{ currentUser.username }}
        </span>
        <VMenu v-if="currentUser.id !== 0" anchor="bottom end">
            <template v-slot:activator="{ props }">
                <VBtn
                    icon
                    v-bind="props"
                >
                    <VAvatar >
                        <VImg
                            src="/default-avatar.webp"
                        />
                    </VAvatar>
                </VBtn>
            </template>
            <VList>
                <VListItem to="/profile">
                    <template #prepend>
                        <VIcon icon="mdi-account" />
                    </template>
                    <VListItemTitle>
                        {{ t('account.self') }}
                    </VListItemTitle>
                </VListItem>
                <VListItem to="/roleplays">
                    <template #prepend>
                        <VIcon icon="mdi-book-open-page-variant-outline" />
                    </template>
                    <VListItemTitle>
                        {{ t('pages.roleplays.navlink') }}
                    </VListItemTitle>
                </VListItem>
                <VListItem
                    v-if="currentUser.superadmin"
                    to="/administration"
                >
                    <template #prepend>
                        <VIcon icon="mdi-security" />
                    </template>
                    <VListItemTitle>
                        Administration
                    </VListItemTitle>
                </VListItem>
                <VDivider />
                <VListItem @click="logout">
                    <template #prepend>
                        <VIcon icon="mdi-logout" />
                    </template>
                    <VListItemTitle>
                        {{ t('account.logout') }}
                    </VListItemTitle>
                </VListItem>
                <VDivider />
                <VListItem @click="switchTheme">
                    <template #prepend>
                        <VIcon :icon="theme.current.value.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'" />
                    </template>
                    <VListItemTitle>
                        {{ t(theme.current.value.dark ? 'account.light' : 'account.dark') }}
                    </VListItemTitle>
                </VListItem>
            </VList>
        </VMenu>
        <VBtn
            v-else
            to="/login"
            color="primary"
        >
            {{ t('login.action')}}
        </VBtn>
    </VAppBar>

</template>
