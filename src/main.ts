import { createPinia } from 'pinia'
import createPersistedState from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './App.vue'
import router from './plugins/router'
import vuetify from './plugins/vuetify'
// import './style.css'

import '@mdi/font/css/materialdesignicons.css'

const pinia = createPinia()
pinia.use(createPersistedState)

createApp(App)
    .use(vuetify)
    .use(router)
    .use(pinia)
    .mount('#app')
