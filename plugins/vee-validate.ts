import { localize, setLocale } from '@vee-validate/i18n'
import { configure, defineRule } from 'vee-validate'
import { confirmed, email, max, min, required } from '@vee-validate/rules'
import fr from '@vee-validate/i18n/dist/locale/fr.json'
import en from '@vee-validate/i18n/dist/locale/en.json'

export default defineNuxtPlugin(() => {
    defineRule('email', email)
    defineRule('required', required)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('confirmed', confirmed)

    configure({
        // generateMessage: localize({ fr, en }),
        generateMessage: localize({
            fr: {
                messages: {
                    ...fr.messages,
                    required: 'Le champ est requis',
                },
            },
            en: {
                messages: {
                    ...en.messages,
                    required: 'The field is required',
                },
            },
        }),
    })

    setLocale('fr')
})
