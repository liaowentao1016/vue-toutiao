import axios from 'axios'
import store from '@/store/'
import JSONbig from 'json-bigint'
import { Toast } from 'vant'
import router from '@/router'

// 创建axios实例
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 为了解决服务端返回大数字的问题 告诉axios不要使用Json.parse()来转换这个数据而使用json-bigint来处理
  transformResponse: [
    function(data) {
      // 后端返回的数据可能不是 JSON 格式字符串
      // 如果不是的话，那么 JSONbig.parse 调用就会报错
      // 所以我们使用 try-catch 来捕获异常，处理异常的发生
      try {
        // 如果转换成功，则直接把结果返回
        return JSONbig.parse(data)
      } catch (err) {
        // console.log('转换失败', err)
        // 如果转换失败了，则进入这里
        // 我们在这里把数据原封不动的直接返回给请求使用
        return data
      }

      // axios 默认在内部使用 JSON.parse 来转换处理原始数据
      // return JSON.parse(data)
    }
  ]
})
// 再次创建axios实例用于获取新的token
// 通过该实例发送的请求不会在进入request实例的拦截器中
const refreshReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const { user } = store.state
    if (user) {
      // 如果用户是登录状态 统一在请求头中加上token
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 处理完之后一定要将 config返回
    return config
  },
  err => Promise.reject(err)
)

// 响应拦截器 处理服务端返回的错误信息
request.interceptors.response.use(
  response => response,
  async error => {
    // 获取错误状态码
    const status = error.response.status
    if (status === 400) {
      Toast.fail('客户端参数异常')
    } else if (status === 401) {
      // token 失效
      // 1. 获取容器中的user
      const { user } = store.state
      // 2. 如果没有user 或者没有user.token 直接跳转到login页面 让用户登录
      if (!user || !user.token) {
        redirectLogin()
      }
      // 3. 通过refresh_token发送请求获取新的token
      try {
        const { data } = await refreshReq({
          method: 'PUT',
          url: '/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })
        console.log('获取新的token')
        // 将返回的新的token同步到vuex容器中
        user.token = data.data.token
        store.commit('setUser', user)
        // 将失败的请求重新发送出去 获取数据
        // error.config是本次请求的相关配置对象
        // 这里使用request发送请求它会走自己的拦截器 会将更新过后的token加入请求头中
        return request(error.config)
      } catch (error) {
        // 如果重新获取新的token 失败 那就干脆让用户重新登录
        redirectLogin()
      }
    } else if (status === 403) {
      Toast.fail('没有权限操作')
    } else if (status >= 500) {
      Toast.fail('服务端异常')
    }
    return Promise.reject(error)
  }
)

function redirectLogin() {
  router.replace({
    path: '/login',
    query: {
      // 数据名是自己起的
      // router.currentRoute 和我们在组件中获取的 this.$route 是一个东西
      redirect: router.currentRoute.fullPath
    }
  })
}

export default request
