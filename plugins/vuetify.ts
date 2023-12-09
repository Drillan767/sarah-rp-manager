import { createVuetify } from "vuetify/lib/framework.mjs"

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        ssr: true,
        defaults: {
            VTextField: {
                variant: 'outlined',
                color: 'primary',
            },
            VTextarea: {
                variant: 'outlined',
                color: 'primary',
            }
        }
    })

    nuxtApp.vueApp.use(vuetify)
})
