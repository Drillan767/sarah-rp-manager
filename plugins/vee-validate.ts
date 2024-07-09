import { localize, setLocale } from '@vee-validate/i18n'
import { configure, defineRule } from 'vee-validate'
import { confirmed, email, image, max, min, min_value as minValue, required } from '@vee-validate/rules'
import fr from '@vee-validate/i18n/dist/locale/fr.json'
import en from '@vee-validate/i18n/dist/locale/en.json'
import dayjs from 'dayjs'
import type { Database } from '~/types/supabase'

export default defineNuxtPlugin(() => {
    const supabase = useSupabaseClient<Database>()

    defineRule('email', email)
    defineRule('required', required)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('confirmed', confirmed)
    defineRule('image', image)
    defineRule('min_value', minValue)

    // Allows to check wether this email or username already exists, avoiding error post submission.
    defineRule('unique', (value: string, [field]: ['email' | 'username']): Promise<string | boolean> => {
        return new Promise((resolve) => {
            Promise.resolve()
                .then(() => supabase.from('users')
                    .select('*', {
                        count: 'exact',
                        head: true,
                    })
                    .eq(field, value))
                .then((result) => {
                    resolve(result.count !== null && result.count === 0)
                })
        })
    })

    defineRule('notBefore', (value: string, [date]: [string]) => {
        const beforeDate = dayjs(date)
        const testDate = dayjs(value)

        if (!testDate.isValid() || beforeDate.isAfter(testDate))
            return false

        return true
    })

    defineRule('notAfter', (value: string, [date]: [string]) => {
        const afterDate = dayjs(date)
        const testDate = dayjs(value)

        if (!testDate.isValid() || afterDate.isBefore(testDate))
            return false

        return true
    })

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
            en: {
                messages: {
                    ...en.messages,
                    required: 'The field is required',
                    unique: 'A user with this {field} already exists',
                    min_value: 'The field must have a value of 0:{min} or more',
                },
            },
        }),
    })

    setLocale('fr')
})
