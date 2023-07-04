<template>
    <div class="container-fluid">
        <button @click="increment()">Incrémenter</button>
        {{ doubleCount }}
    </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
import { useBreadcrumbStore } from '~~/stores/breadcrumb'
import { useUserStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

useHead({
    title: 'Accueil'
})

const router = useRouter()
const supabase = useSupabaseAuthClient()
const store = useCounterStore()
const breadcrumb = useBreadcrumbStore()
const userStore = useUserStore()

const logout = async() => {

    const { error } = await supabase.auth.signOut()
    router.push('/connexion')
}

const { name, doubleCount } = storeToRefs(store)
const { increment } = store

</script>