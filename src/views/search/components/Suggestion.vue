<template>
  <div class="uggestion">
    <van-cell
      icon="search"
      v-for="(item, index) in suggestions"
      :key="index"
      @click="$emit('search', item)"
    >
      <div slot="title" v-html="heighLight(item)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/network/search'
// 导入防抖处理函数
import { debounce } from 'lodash'

export default {
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 联想建议数据
      suggestions: []
    }
  },
  watch: {
    // 监听searchText的变化 发请求获取联想数据
    // warch的完整写法
    searchText: {
      // async handler() {
      //   const { data } = await getSearchSuggestions(this.searchText)
      //   this.suggestions = data.data.options
      // },
      // debounce  参数一:需要被防抖处理的函数  参数二:时间间隔  返回值:防抖处理的函数
      handler: debounce(async function () {
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 300),
      immediate: true // 配置这个是为了让handler被立即调用
    }
  },
  methods: {
    heighLight(str) {
      // 匹配字符的高亮显示
      // RegExp 是正则表达式的构造函数
      // 参数一：字符串 或 表达式
      // 参数二：匹配模式
      // 返回值：正则对象
      return str.replace(
        new RegExp(this.searchText, 'gi'),
        `<span style="color:red">${this.searchText}</span>`
      )
    }
  }
}
</script>

<style lang="less" scoped>
</style>
