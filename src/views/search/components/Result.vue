<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/network/search'

export default {
  props: {
    searchText: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      // 请求参数
      params: {
        page: 1, // 页码
        per_page: 30, // 每页显示的数量
        q: this.searchText
      }
    }
  },
  methods: {
    async onLoad() {
      // 1. 请求获取数据
      const { data } = await getSearchResult(this.params)
      // 2. 将数据存至data中
      const { results } = data.data
      this.list.push(...results)
      // 3. 关闭loading状态
      this.loading = false
      // 4. 判断是否还有数据 有就更新页码 请求下一页数据，没有就finished不在调用onLoad
      if (results.length) {
        this.params.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
