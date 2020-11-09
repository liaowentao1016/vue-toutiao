<template>
  <div class="comment-item">
    <van-cell>
      <van-image
        slot="icon"
        round
        fit="cover"
        :src="comment.aut_photo"
        class="avatar"
      />
      <div slot="title">
        <div class="title-wrap">
          <div class="name">{{ comment.aut_name }}</div>
          <div class="like-wrap" @click="onCommentLike">
            <van-icon
              :name="comment.is_liking ? 'good-job' : 'good-job-o'"
              class="like-icon"
              :color="comment.is_liking ? 'hotpink' : ''"
            />
            <span class="like-count">{{ comment.like_count }}</span>
          </div>
        </div>

        <div class="content">{{ comment.content }}</div>
        <span class="pubdate">{{
          comment.pubdate | datetime('MM-DD HH:mm')
        }}</span>
        <van-button
          size="mini"
          round
          class="reply-btn"
          @click="$emit('on-reply', comment)"
          >{{ comment.reply_count }} 回复</van-button
        >
      </div>
    </van-cell>
  </div>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/network/comment'

export default {
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  methods: {
    async onCommentLike() {
      this.$toast.loading({
        message: '处理中...',
        forbidClick: true
      })
      // 已经点赞 点击取消，为点赞点击点赞
      const commentId = this.comment.com_id.toString()
      if (this.comment.is_liking) {
        await deleteCommentLike(commentId)
        this.comment.like_count--
        this.$toast.success('取消点赞成功')
      } else {
        await addCommentLike(commentId)
        this.comment.like_count++
        this.$toast.success('点赞成功')
      }
      this.comment.is_liking = !this.comment.is_liking
    }
  }
}
</script>

<style lang="less" scoped>
.comment-item {
  .avatar {
    width: 36px;
    height: 36px;
    margin-right: 12px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    .name {
      font-size: 13px;
      color: #406599;
    }
  }

  .contnet {
    font-size: 16px;
    color: #222;
  }
  .pubdate {
    font-size: 10px;
  }
}
</style>
