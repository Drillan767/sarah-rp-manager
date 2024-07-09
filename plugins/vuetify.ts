import { createVuetify } from 'vuetify'
import { VNumberInput } from 'vuetify/labs/VNumberInput'

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
            },
            VSelect: {
                variant: 'outlined',
                color: 'primary',
            },
            VFileInput: {
                variant: 'outlined',
                color: 'primary',
            },
            VNumberInput: {
                variant: 'outlined',
                color: 'primary',
                min: 0,
            },
        },
        components: {
            VNumberInput,
        },
    })

    nuxtApp.vueApp.use(vuetify)
})
