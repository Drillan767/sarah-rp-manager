import { createVuetify } from "vuetify/lib/framework.mjs"
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VStepper, VStepperItem, VStepperHeader, VStepperWindow, VStepperWindowItem } from 'vuetify/labs/VStepper'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        ssr: true,
        components: {
            VDataTable,
            VStepper,
            VStepperHeader,
            VStepperItem,
            VStepperWindow,
            VStepperWindowItem,
            ...components,
        },
        directives,
    })

    nuxtApp.vueApp.use(vuetify)
})
