import axios from 'axios'
import store from '@/store/'

// 创建axios实例
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const { user } = store.state
    if (user) {
      // 如果用户是登录状态 统一在请求头中加上token
      config.headers.Authorization = `Bearer ${store.state.user.token}`
    }
    // 处理完之后一定要将 config返回
    return config
  },
  err => Promise.reject(err)
)

export default request
