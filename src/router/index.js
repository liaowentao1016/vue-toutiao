import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login')
  },
  {
    path: '/',
    component: () => import('@/views/layout/LayOut'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/home/Home')
      },
      {
        path: '/question',
        name: 'Questione',
        component: () => import('@/views/question/Question')
      },
      {
        path: '/video',
        name: 'Video',
        component: () => import('@/views/video/Video')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/profile/Profile')
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
