import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入格式化时间
import '@/util/dayjs'

// 导入 amfe-flexible 用于自动设置rem基准值
import 'amfe-flexible'

// 导入vant ui 组件库
import Vant from 'vant'
// 导入vant ui的样式文件
import 'vant/lib/index.css'
// 全局注册vant
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
