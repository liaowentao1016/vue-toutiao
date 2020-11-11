import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'

import { Dialog } from 'vant'

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
    component: () => import('@/views/edit-profile/EditProfile'),
    meta: { requiresAuth: true }
  },
  {
    path: '/userChat',
    name: 'UserChat',
    component: () => import('@/views/user-chat/UserChat'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

// 全局路由导航守卫
router.beforeEach((to, from, next) => {
  // 如果你想要去的页面需要登录才能访问
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 判断用户是否登录
    const { user } = store.state
    if (!user) {
      // 未登录提示用户 跳转到登录页面
      Dialog.confirm({
        title: '访问提示',
        message: '该页面需要登录，是否登录？？'
      })
        .then(() => {
          // on confirm
          next({
            path: '/login',
            query: { redirect: from.fullPath }
          })
        })
        .catch(() => {
          // on cancel 中断当前导航
          next(false)
        })
    } else {
      // 如果用户登录了那就直接放行
      next()
    }
  } else {
    // 你想要去的页面不需要登录也能访问那就直接放行
    next() // 确保一定要调用 next()
  }
})

export default router
