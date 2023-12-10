interface Snackbar {
    display: boolean
    color: 'success' | 'warning' | 'error' | 'default'
    message: string
    closeable: true
    timeout: number
}

const snackbar = ref<Snackbar>({
    message: '',
    color: 'success',
    timeout: 2000,
    closeable: true,
    display: false,
})

function showSuccess(message: string) {
    snackbar.value.message = message
    snackbar.value.color = 'success'
    snackbar.value.display = true
}

function showError(message: string) {
    snackbar.value.message = message
    snackbar.value.color = 'error'
    snackbar.value.display = true
}

export default function useSnackBar() {
    return {
        snackbar,
        showError,
        showSuccess,
    }
}
