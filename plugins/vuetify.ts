import { createVuetify } from "vuetify/lib/framework.mjs"
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        ssr: true,
        components,
        directives,
    })

    nuxtApp.vueApp.use(vuetify)
})