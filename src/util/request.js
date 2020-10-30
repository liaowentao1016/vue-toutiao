import axios from 'axios'

// 创建axios实例
const request = axios.create({
  baseURL: ' http://ttapi.research.itcast.cn/'
})

export default request
