// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        'dayjs-nuxt',
        '@vee-validate/nuxt',
        '@nuxtjs/supabase',
        '@nuxtjs/i18n',
    ],

    devtools: { enabled: true },

    i18n: {
        lazy: true,
        locales: [
            {
                code: 'fr',
                file: 'fr-FR.json'
            },
            {
                code: 'en',
                file: 'en-US.json',
            },
        ],
        langDir: 'lang',
        defaultLocale: 'fr',
    },

    dayjs: {
        locales: ['fr', 'en'],
        defaultLocale: 'fr',
        plugins: ['relativeTime', 'utc', 'weekOfYear'],
    },

    supabase: {
        redirectOptions: {
            login: '/login',
            callback: '/callback',
            exclude: [
                '/',
                 '/register',
                '/forgot-password',
                '/new-password',
                '/roleplays/*'
            ],
        },
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

    css: [
        'vuetify/lib/styles/main.sass',
        '@mdi/font/css/materialdesignicons.min.css',
        '~/assets/scss/main.scss',
    ],

    build: {
        transpile: ['vuetify']
    }
})
