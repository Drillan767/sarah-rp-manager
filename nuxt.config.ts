// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/supabase',
        'dayjs-nuxt',
        '@nuxtjs/tailwindcss'
    ],

    css: [
        '~/assets/scss/main.scss'
    ],

    app: {
        head: {
            titleTemplate: '%s | Le Jardin de Sarah',
        }
    },

    runtimeConfig: {
        public: {
            supabaseURl: process.env.SUPABASE_URL,
            supabaseKey: process.env.SUPABASE_KEY,
        },
    },

    devtools: { enabled: true }
})
