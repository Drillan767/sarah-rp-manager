import { createApp } from 'vue'
import App from './App.vue'
import router from './plugins/router'
import vuetify from './plugins/vuetify'
// import './style.css'

import '@mdi/font/css/materialdesignicons.css'

createApp(App)
    .use(vuetify)
    .use(router)
    .mount('#app')
