import {
    createRouter,
    createWebHistory
} from "vue-router";
import Home from '../page/home/home.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [{
        path: '/home',
        component: Home
    },{
        path: '/city',
        component: Home
    }],
})

export default router;