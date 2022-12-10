import {
    createRouter,
    createWebHashHistory
} from "vue-router";


import Home from '../page/home/home.vue'
import About from '../components/WelcomeItem.vue'
import City from '../page/city/city.vue'
import Profile from '../page/profile/profile.vue'





const routes = [{
        path: '',
        redirect: '/home'
    },
    //首页城市列表页
    {
        path: '/home',
        component: Home
    },
    {
        path: '/about',
        component: About
    },
    {
        path: '/city/:cityId',
        component: City
    }, {
        path: '/profile',
        component: Profile
    },
]

const router = createRouter({
    history: createWebHashHistory('/'),
    routes
})

export default router