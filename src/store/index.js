import Vue from 'vue'
import Vuex from 'vuex'

import { getItem, setItem } from '@/util/storage'

const USER_KEY = 'toutiao-user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 存储用户的状态 (Token信息等)
    user: getItem(USER_KEY),
    // 需要缓存的组件
    cacheComponents: ['LayOut']
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
      // 为了防止页面刷新数据丢失 所以要将数据保存在本地储存中 仅仅是为了数据的持久化
      // 本地储存中的数据必须是字符串类型
      setItem(USER_KEY, state.user)
    },
    addCacheComponent(state, name) {
      if (!state.cacheComponents.includes(name)) {
        state.cacheComponents.push(name)
      }
    },
    romoveCacheComponent(state, name) {
      const index = state.cacheComponents.indexOf(name)
      if (index !== -1) {
        state.cacheComponents.splice(index, 1)
      }
    }
  },
  actions: {},
  modules: {}
})
