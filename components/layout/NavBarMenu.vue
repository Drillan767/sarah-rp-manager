<script setup lang="ts">
import { useDisplay, useTheme } from 'vuetify'
import type { Database } from '~/types/supabase'
import type { CurrentUser } from '~/types/models'

defineProps<{ displayUsername: boolean }>()

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
    <template v-if="currentUser">
        <VListItem
            v-if="!mobile && displayUsername"
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
                    :title="t('account.self')"
                    to="/profile"
                    prepend-icon="mdi-account"
                />
                <VListItem
                    :title="t('pages.roleplays.my')"
                    to="/my-roleplays"
                    prepend-icon="mdi-book-open-page-variant-outline"
                />
                <VDivider />
                <VListItem
                    :title="t('pages.roleplays.browse')"
                    to="/all-roleplays"
                    prepend-icon="mdi-bookshelf"
                />
                <VListItem
                    :title="t('account.logout')"
                    prepend-icon="mdi-logout"

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
        {{ t('login.action') }}
    </VBtn>
</template>
