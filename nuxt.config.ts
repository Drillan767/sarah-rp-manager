// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/supabase',
        'dayjs-nuxt',
    ],

    css: [
        '~/assets/scss/main.scss'
    ],

    devtools: { enabled: true }
})
