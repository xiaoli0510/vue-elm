import App from '../App.vue';
import {
    createRouter,
    createWebHashHistory
} from 'vue-router'


const routes = [{
    path: '/',
    component: App, //顶层路由，对应index.html
    children: [{
            //地址为空时跳转home页面
            path: '',
            redired: '/home'
        },
        //首页城市列表页
        {
            path: '/home',
            component: () => import('../page/home/home.vue')
        }
    ]
}]

const router = createRouter({
    history: createWebHashHistory('/'),
    routes
})

export default router