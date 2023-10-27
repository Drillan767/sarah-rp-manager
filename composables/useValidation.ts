import { useI18n } from 'vue-i18n'

export default function useValidation() {
    const { t } = useI18n()
    const dayjs = useDayjs()

    const requiredRule = (value: any) => !!value || t('form.required')
    const emailRule = (value: string) => /.+@.+\..+/.test(value) || t('form.email')
    const confirmedRule = (value: string, ref: string) => value === ref || t('form.confirmed')
    const minLengthRule = (value: string, min: number) => value && value.length >= min || t('form.minLength', { count: min})
    const maxLengthRule = (value: string, max: number) => {
        if (value) {
            return value.length <= max || t('form.maxLength', { count: max})
        }
        return true
    }
    // const minValueRule = (value: number, min: number) => value <= min || t('form.minValue', { value: min })
    const minValueRule = (min: number, value: any) => parseInt(value) >= min || t('form.minValue', { value: min })
    const imageRule = (editing: boolean, value: File | null) => {
        if (!editing && value === null) {
            return t('form.required')
        } else {
            if (value) {
                if (!value.type.includes('image')) return t('form.badFormat')
                if (value.size > 2000000) return t('form.tooBig')
            }
        }

        return true
    }

    const notBeforeRule = (before: string, value: string) => {
        const beforeDate = dayjs(before)
        const testDate = dayjs(value)

        if (beforeDate.isAfter(testDate)) return t('form.dateAfter', { date: beforeDate.format('DD/MM/YYYY') })

        return true
    }

    const notAfterRule = (after: string, value: string) => {
        const afterDate = dayjs(after)
        const testDate = dayjs(value)

        if (afterDate.isAfter(testDate)) return t('form.dateAfter', { date: afterDate.format('DD/MM/YYYY') })

        return true
    }

    return {
        requiredRule,
        emailRule,
        confirmedRule,
        minLengthRule,
        maxLengthRule,
        minValueRule,
        imageRule,
        notBeforeRule,
        notAfterRule,
    }
}
