<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
import type { Database } from '~/types/supabase'
import type { RoleplayFormType } from '@/types'
import Form from '@/components/rp/RpForm.vue'
import RpListRoles from '@/components/rp/RpListRoles.vue'

const router = useRouter()
const route = useRoute()
const supabase = useSupabaseClient<Database>()
const currentUser = useCurrentUser()

const form = ref<RoleplayFormType>({} as RoleplayFormType)
const loadRP = ref(false)

onMounted(async () => {
    if (currentUser.value.isSarah === false)
        router.push('/')

    loadRP.value = true
    const rpId = route.params.id

    const { data } = await supabase
        .from('roleplays')
        .select(`*,
                roles(id, name, max_users, roleplay_id, description)`)
        .eq('id', rpId)
        .single()

    if (!data)
        router.push('/')

    else
        form.value = data
    useHead({
        title: `Éditer ${form.value.title}`,
    })

    loadRP.value = false
})

function success() {
    // Oui bravo
}
</script>

<template>
    <div>
        <div class="flex justify-between">
            <button
                class="mb-4 btn btn-primary"
                @click="router.back()"
            >
                <ArrowLeftIcon class="w-4 h-4" />
                Retour
            </button>
            <button class="mb-4 btn btn-secondary">
                Modifier les rôles
            </button>
        </div>

        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Éditer "{{ form.title }}"
            </h2>
            <Form
                :edit="true"
                :form="form"
                :loading="loadRP"
            />
            <RpListRoles
                :roles="form.roles"
            />
        </div>
    </div>
</template>
