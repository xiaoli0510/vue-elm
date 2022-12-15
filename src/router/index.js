import {
    createRouter,
    createWebHistory
} from "vue-router";
import Home from '../page/home/home.vue'
import Login from '../page/login/login.vue'
import Forget from '../page/forget/forget.vue'
import City from '../page/city/city.vue'
import Msite from '../page/msite/msite.vue'





const router = createRouter({
    history: createWebHistory(),
    routes: [{
        path: '/home',
        component: Home
    },{
        path: '/city/:cityid',
        component: City,
        children: [
            { path: '', component: City, alias: ['/:cityid', ''] },
          ],
    },{
        path: '/login',
        component: Login
    },{
        path: '/profile',
        component: Home
    },{
        path: '/forget',
        component: Forget
    },{
        path: '/msite',
        component: Msite
    }],
})

export default router;