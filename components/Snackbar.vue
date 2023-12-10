<script setup lang="ts">
import useSnackBar from '~/composables/snackbar'

const { snackbar } = useSnackBar()
const { t } = useI18n()
</script>

<template>
    <VSnackbar
        v-model="snackbar.display"
        :color="snackbar.closeable ? '' : snackbar.color "
        :timeout="snackbar.timeout"
        :multi-line="true"
    >
        <template v-if="snackbar.closeable" #actions>
            <VBtn
                :color="snackbar.color"
                variant="text"
                @click="snackbar.display = false"
            >
                {{ t(('form.close')) }}
            </VBtn>
        </template>

        {{ snackbar.message }}
    </VSnackbar>
</template>
