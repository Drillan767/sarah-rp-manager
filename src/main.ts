import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import createPersistedState from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './App.vue'
import router from './plugins/router'
import vuetify from './plugins/vuetify'
import './plugins/vee-validate'

import '@mdi/font/css/materialdesignicons.css'

const pinia = createPinia()
pinia.use(createPersistedState)

const head = createHead()

createApp(App)
    .use(vuetify)
    .use(router)
    .use(head)
    .use(pinia)
    .mount('#app')
