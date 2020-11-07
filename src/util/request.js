import axios from 'axios'
import store from '@/store/'
import JSONbig from 'json-bigint'
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
