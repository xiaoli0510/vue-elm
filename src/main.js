import {createApp } from 'vue'
import router from './router/router'

import App from './App.vue'
const dom = document.createElement('div')
document.body.append(dom)


const app = createApp(App);
app.use(router)
app.mount('#app')