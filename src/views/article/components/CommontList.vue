<template>
  <div class="comment=list">
    <van-cell title="全部评论"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <comment-item
        v-for="(item, index) in list"
        :key="index"
        :comment="item"
        @on-reply="$emit('on-reply', $event)"
      />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/network/comment'

import CommentItem from './CommentItem'

export default {
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    type: {
      type: String,
      default: 'a'
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null, // 评论id，根据此id来获取下一页的数据，相当于页码
      limit: 20 // 每页显示的数量
    }
  },
  methods: {
    async onLoad() {
      // 1.请求获取评论
      const { data } = await getComments({
        type: this.type, // a为文章评论，c为评论的回复
        source: this.source.toString(), // 源ID 文章id或评论id
        offset: this.offset,
        limit: this.limit
      })
      // 将评论的总数量发给父组件
      this.$emit('updata-total-count', data.data.total_count)
      // 2.将评论数据保存到data中
      const { results } = data.data
      this.list.push(...results)
      // 3. 结束本次loading 状态
      this.loading = false
      // 4. 判断下次是否有数据
      if (results.length) {
        // 如果有更新页码
        this.offset = data.data.last_id
      } else {
        // 如果没有将finished设置为true不在加载更多
        this.finished = true
      }
    }
  },
  components: {
    CommentItem
  }
}
</script>

<style lang="less" scoped>
</style>
