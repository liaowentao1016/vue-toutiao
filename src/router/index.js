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
  },
  {
    path: '/search',
    component: () => import('@/views/search/Search')
  },
  {
    name: 'article',
    path: '/article/:articleId',
    component: () => import('@/views/article/Article'),
    // 将动态路由参数映射到组件的props中，有利于维护与访问
    props: true
  },
  {
    path: '/editProfile',
    name: 'EditProfile',
    component: () => import('@/views/edit-profile/EditProfile')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
