import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default function useToast() {
    const showSuccess = (message: string) => {
        toast.success(message)
    }
    const showError = (message: string) => {
        toast.error(message)
    }
    return {
        showSuccess,
        showError,
    }
}
