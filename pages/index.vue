<template>
    <div class="container-fluid">
        <button @click="increment()">Incrémenter</button>
        {{ doubleCount }}
    </div>

    <div>
        <p>{{ user }}</p>
    </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'
import { useUserStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

useHead({
    title: 'Accueil'
})

const router = useRouter()
const supabase = useSupabaseAuthClient()
const store = useCounterStore()
const userStore = useUserStore()

const logout = async() => {

    const { error } = await supabase.auth.signOut()
    router.push('/connexion')
}

const { name, doubleCount } = storeToRefs(store)
const { user } = storeToRefs(userStore)
const { increment } = store

</script>