import { confirmed, email, image, max, min, min_value as minValue, required } from '@vee-validate/rules'
import { defineRule } from 'vee-validate'

defineRule('email', email)
defineRule('required', required)
defineRule('min', min)
defineRule('max', max)
defineRule('confirmed', confirmed)
defineRule('image', image)
defineRule('min_value', minValue)
