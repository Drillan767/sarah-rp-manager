import { createVuetify } from 'vuetify'

export default createVuetify({
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
