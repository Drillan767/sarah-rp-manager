<script setup lang="ts">
import { useTheme } from 'vuetify'
import type { Database } from '~/types/supabase'
import type { CurrentUser } from '~/types/models'

const currentUser = useState<CurrentUser>('current-user')

const { t } = useI18n()
const theme = useTheme()

const supabase = useSupabaseClient<Database>()
const router = useRouter()
const user = useSupabaseUser()

async function logout() {
    await supabase.auth.signOut()
    await router.push('/')
}

function switchTheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

async function login() {
    await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
            redirectTo: 'http://localhost:3000/confirm',
        },
    })
}

watch(user, (value) => {
    if (value) {
        const { user_metadata: twitter } = value

        currentUser.value = {
            handle: twitter.user_name,
            username: twitter.name,
            avatar: twitter.picture,
        }
    }
}, { immediate: true })

/* onMounted(async () => {
    if (user.value) {
        const { data } = await supabase
            .from('users')
            .select('username, superadmin, id')
            .eq('session_id', user.value.id)
            .single()

        if (data)
            currentUser.value = data
    }
}) */
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

        <VListItem
            v-if="currentUser"
            :title="currentUser.username"
            :subtitle="`@${currentUser.handle}`"
            class="text-right"
        />

        <VMenu v-if="currentUser" anchor="bottom end">
            <template #activator="{ props }">
                <VBtn
                    v-bind="props"
                    icon
                >
                    <VAvatar :image="currentUser.avatar" />
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
                <!-- <VListItem
                    v-if="currentUser.superadmin"
                    to="/administration"
                    prepend-icon="mdi-security"
                    title="Administration"
                /> -->
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
            color="primary"
            @click="login"
        >
            {{ t('login.action') }}
        </VBtn>
    </VAppBar>
</template>
