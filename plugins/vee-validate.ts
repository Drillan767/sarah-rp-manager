import { localize, setLocale } from '@vee-validate/i18n';
import { defineRule, configure } from 'vee-validate'
import { required, email, confirmed, min } from '@vee-validate/rules'
import fr from '@vee-validate/i18n/dist/locale/fr.json'
import en from '@vee-validate/i18n/dist/locale/en.json'

export default defineNuxtPlugin((nuxtApp) => {
    defineRule('email', email)
    defineRule('required', required)
    defineRule('min', min)
    defineRule('confirmed', confirmed)

    configure({
        // generateMessage: localize({ fr, en }),
        generateMessage: localize({
            fr: {
                messages: {
                    ...fr.messages,
                    required: 'Le champ est requis',
                }
            },
            en: {
                messages: {
                    ...en.messages,
                    required: 'The field is required',
                }
            }
        })
    });

    setLocale('fr')

})