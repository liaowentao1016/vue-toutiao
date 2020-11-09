<template>
  <div class="post-comment">
    <van-field
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="100"
      placeholder="请输入评论"
      show-word-limit
    />
    <van-button round class="btn" @click="postComment" :disabled="!message"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addComment } from '@/network/comment'
export default {
  props: {
    // 如果评论文章则传递文章id
    // 如果评论回复则传递评论id
    target: {
      type: [Number, String, Object],
      required: true
    },
    // 文章id 如果评论回复则需要传递此参数
    // 评论文章不需要传递此参数
    art_id: {
      type: [Number, String, Object]
    }
  },
  data() {
    return {
      message: ''
    }
  },
  methods: {
    async postComment() {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true // 禁止背景点击
      })
      const { data } = await addComment({
        target: this.target.toString(),
        content: this.message,
        art_id: this.art_id ? this.art_id.toString() : null
      })

      // 发送评论成功
      this.$emit('post-success', data.data.new_obj)
      // 提示用户
      this.$toast.success('发布成功')
      // 清空文本框内容
      this.message = ''
    }
  }
}
</script>

<style lang="less" scoped>
.post-comment {
  padding: 12px;
  display: flex;
  align-items: flex-start;
  .btn {
    width: 70px;
    height: 20px;
  }
}
</style>
