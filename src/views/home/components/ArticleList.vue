<template>
  <div class="article-list" ref="articleList">
    <van-pull-refresh
      v-model="isRfreshLoading"
      @refresh="onRefresh"
      success-duration="1000"
      success-text="刷新成功"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-item
          v-for="(item, index) in articles"
          :key="index"
          :article="item"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/network/article'

import ArticleItem from '@/components/common/ArticleItem'

import { debounce } from 'lodash'

export default {
  props: {
    channel: {
      type: Object,
      default() {
        return {}
      },
      required: true
    }
  },
  data() {
    return {
      articles: [],
      loading: false, // 上拉加载的loading状态
      isRfreshLoading: false, // 下拉刷新的loading状态
      finished: false,
      // 请求参数对象
      params: {
        channel_id: this.channel.id, // 频道ID
        // 时间戳，相当于页码,当传入当前时间戳时相当于获取第一页的数据，
        // 上一页数据返回结果中会有下一页数据的时间戳通过该时间戳来获取下一页的数据
        timestamp: Date.now(),
        with_top: 1, // 是否置顶
        articleListDom: null, // 组件DOM元素
        scrollTop: null // 用来记录滚动的距离
      }
    }
  },
  methods: {
    async onLoad() {
      // 1.发送请求 获取数据
      const { data } = await getArticles(this.params)
      // 2.将数据放在数组中
      const { results } = data.data
      this.articles.push(...results)
      // 3.结束本次加载
      this.loading = false
      // 4.判断数据是否全部加载完成
      if (results.length) {
        // 更新获取下一页数据的页码
        this.params.timestamp = data.data.pre_timestamp
      } else {
        // 没有数据了 结束加载 不在执行load事件
        this.finished = true
      }
    },

    async onRefresh() {
      // 1.发送请求 获取数据
      const { data } = await getArticles(this.params)
      // 2.将数据放在数组中 (往顶部追加)
      const { results } = data.data
      this.articles.unshift(...results)
      // 3.结束本次刷新
      this.isRfreshLoading = false
    }
  },
  components: {
    ArticleItem
  },
  mounted() {
    this.articleListDom = this.$refs.articleList
    // 1.监听滚动事件
    this.articleListDom.onscroll = debounce(() => {
      this.scrollTop = this.articleListDom.scrollTop
    }, 50)
  },
  // 组件被激活调用 与keep-alive配合使用
  activated() {
    this.articleListDom.scrollTop = this.scrollTop
  }
}
</script>

<style lang="less" scoped>
.article-list {
  //   position: fixed;
  //   top: 90px;
  //   bottom: 50px;
  //   left: 0;
  //   right: 0;
  //   overflow-y: auto;
  height: calc(100vh - 140px);
  overflow-y: auto;
}
</style>
