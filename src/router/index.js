import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/Search.vue')
    },
    {
      path: "/sceneDetails",
      name: 'sceneDetails',
      component: () => import('../views/SceneDetails.vue')
    },
    {
      path: "/tempDetail",
      name: 'tempDetail',
      component: () => import('../views/TempDetail.vue')
    },
    {
      path: "/themeDetails",
      name: 'themeDetails',
      component: () => import('../views/ThemeDetails.vue')
    },
    {
      path: "/design",
      name: 'design',
      component: () => import('../views/Design.vue')
    },
    {
      path: "/mine",
      name: 'mine',
      component: () => import('../views/Mine.vue')
    }
    
  ]
})

export default router
