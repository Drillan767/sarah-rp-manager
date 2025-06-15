import { localize, setLocale } from '@vee-validate/i18n'
import fr from '@vee-validate/i18n/dist/locale/fr.json'
import { confirmed, email, image, max, min, min_value as minValue, required } from '@vee-validate/rules'
import { configure, defineRule } from 'vee-validate'

defineRule('email', email)
defineRule('required', required)
defineRule('min', min)
defineRule('max', max)
defineRule('confirmed', confirmed)
defineRule('image', image)
defineRule('min_value', minValue)

configure({
    generateMessage: localize({
        fr: {
            messages: {
                ...fr.messages,
                required: 'Le champ est requis',
                unique: 'Un utilisateur avec ce {field} existe déjà',
                min_value: 'Le champ doit avoir une valeur de 0:{min} ou plus',
            },
        },
    }),
})

setLocale('fr')
