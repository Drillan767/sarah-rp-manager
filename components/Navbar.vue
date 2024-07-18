<script setup lang="ts">
import { useDisplay, useTheme } from 'vuetify'
import type { Database } from '~/types/supabase'
import type { CurrentUser } from '~/types/models'

const currentUser = useState<CurrentUser | undefined>('current-user')

const { t } = useI18n()
const theme = useTheme()
const { mobile } = useDisplay()

const config = useRuntimeConfig()
const supabase = useSupabaseClient<Database>()
const router = useRouter()
const user = useSupabaseUser()

async function logout() {
    currentUser.value = undefined
    await supabase.auth.signOut()
    await router.push('/')
}

function switchTheme() {
    theme.global.name.value = theme.global.current.value.dark
        ? 'light'
        : 'dark'
}

async function login() {
    await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
            redirectTo: config.public.redirectUrl,
        },
    })
}

watch(user, (value) => {
    if (value) {
        const { user_metadata: twitter } = value

        currentUser.value = {
            id: value.id,
            handle: twitter.user_name,
            username: twitter.name,
            avatar: twitter.picture,
        }
    }
}, { immediate: true })
</script>

<template>
    <VAppBar
        title="Le Jardin de Sarah"
        class="px-6"
    >
        <template #prepend>
            <RouterLink to="/">
                <VAvatar :tile="true" image="/sarah.jpg" />
            </RouterLink>
        </template>
        <template #append>
            <template v-if="currentUser">
                <VListItem
                    v-if="!mobile"
                    :title="currentUser.username"
                    :subtitle="`@${currentUser.handle}`"
                    class="text-right"
                />

                <VMenu anchor="bottom end">
                    <template #activator="{ props }">
                        <VBtn v-bind="props" icon>
                            <VAvatar :image="currentUser.avatar" />
                        </VBtn>
                    </template>
                    <VList>
                        <VListItem
                            v-if="mobile"
                            :title="currentUser.username"
                            :subtitle="`@${currentUser.handle}`"
                            class="text"
                        />
                        <VDivider v-if="mobile" />
                        <VListItem
                            to="/profile"
                            prepend-icon="mdi-account"
                            :title="t('account.self')"
                        />
                        <VListItem
                            to="/my-roleplays"
                            prepend-icon="mdi-book-open-page-variant-outline"
                            :title="t('pages.roleplays.my')"
                        />
                        <VDivider />
                        <VListItem
                            prepend-icon="mdi-logout"
                            :title="t('account.logout')"
                            @click="logout"
                        />
                        <VDivider />
                        <VListItem
                            :prepend-icon="
                                theme.current.value.dark
                                    ? 'mdi-white-balance-sunny'
                                    : 'mdi-weather-night'
                            "
                            :title="
                                t(
                                    theme.current.value.dark
                                        ? 'account.light'
                                        : 'account.dark',
                                )
                            "
                            @click="switchTheme"
                        />
                    </VList>
                </VMenu>
            </template>

            <VBtn v-else color="primary" @click="login">
                {{ t("login.action") }}
            </VBtn>
        </template>
    </VAppBar>
</template>
