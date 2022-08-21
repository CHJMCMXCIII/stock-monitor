import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "about", */ '../views/HomeView')
    },
    {
        path: '/add',
        name: 'addStockView',
        component: () => import(/* webpackChunkName: "about", */ '../views/AddStockView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  })

export default router