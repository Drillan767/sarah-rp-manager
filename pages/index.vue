<template>
    <div class="container-fluid">
        <img src="https://umnndlllwbgprfqtokmm.supabase.co/storage/v1/object/public/medias/avatar/9f36be6c-fccc-4c24-8894-c96bd83e7c07.png" />
        <button @click="increment()">Incrémenter</button>
        {{ doubleCount }}
    </div>
</template>

<script setup lang="ts">
import type { Database } from 'types/supabase'
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
const session = useSupabaseUser()
const client = useSupabaseClient<Database>()

const logout = async() => {

    const { error } = await supabase.auth.signOut()
    router.push('/connexion')
}

const { name, doubleCount } = storeToRefs(store)
const { increment } = store

</script>