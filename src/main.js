import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index.js'
import {createPinia} from 'pinia'   

import './config/rem'


const app=createApp(App);
app.use(router);
app.use(store);
app.use(createPinia());


app.mount('#app')
