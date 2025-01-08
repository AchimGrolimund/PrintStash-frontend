import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'

import { addIcons, OhVueIcon } from 'oh-vue-icons'
// import { IconName} from 'oh-vue-icons/icons'
addIcons()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.component('v-icon', OhVueIcon)

app.mount('#app')
