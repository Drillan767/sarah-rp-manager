// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'

export default defineNuxtConfig({
    modules: [
        '@nuxtjs/supabase',
        'dayjs-nuxt',
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        '@vee-validate/nuxt',
    ],

    css: [
        '~/assets/scss/main.scss',
    ],

    pinia: {
        autoImports: ['defineStore', 'acceptHMRUpdate'],
    },

    app: {
        head: {
            htmlAttrs: {
                lang: 'fr',
            },
            titleTemplate: '%s | Le Jardin de Sarah',
            link: [
                {
                    rel: 'apple-touch-icon',
                    sizes: '180x180',
                    href: '/favicon/apple-touch-icon.png',
                },
                {
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '32x32',
                    href: '/favicon/favicon-32x32.png',
                },
                {
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '16x16x',
                    href: '/favicon/favicon-16x16.png',
                },
                {
                    rel: 'manifest',
                    href: '/favicon/site.manifest',
                },
            ],
        },
    },

    runtimeConfig: {
        public: {
            supabaseURl: process.env.SUPABASE_URL,
            supabaseKey: process.env.SUPABASE_KEY,
        },
    },

    supabase: {
        redirectOptions: {
            login: '/connexion',
            callback: '/callback',
            exclude: [
                '/inscription',
                '/oubli-mdp',
                '/nouveau-mdp',
                '/profil',
            ],
        },
    },

    dayjs: {
        locales: ['fr'],
        defaultLocale: 'fr',
        plugins: ['relativeTime', 'utc'],
    },

    imports: {
        dirs: ['stores'],
    },

    devtools: { enabled: true },
})
