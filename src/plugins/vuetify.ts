import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'

import 'vuetify/styles/main.css'

export default createVuetify({
    blueprint: md3,
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
})
