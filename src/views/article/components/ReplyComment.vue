<template>
  <div class="reply-comment">
    <van-nav-bar :title="`${replyComment.reply_count}条回复`">
      <van-icon name="cross" slot="left" @click="$emit('close')" />
    </van-nav-bar>
    <div class="wrap">
      <comment-item :comment="replyComment" />
      <comment-list :source="replyComment.com_id" type="c" ref="commentList" />
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isShowPostComment = true"
        >回复</van-button
      >
    </div>
    <!-- /底部区域 -->

    <!--回复输入框-->
    <van-popup v-model="isShowPostComment" position="bottom">
      <post-comment
        :target="replyComment.com_id"
        :art_id="articleId"
        @post-success="onPostSuccess"
      />
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './CommentItem'
import CommentList from './CommontList'
import PostComment from './PostComment'

export default {
  props: {
    replyComment: {
      type: Object,
      default() {
        return {}
      },
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      isShowPostComment: false
    }
  },
  components: {
    CommentItem,
    CommentList,
    PostComment
  },
  methods: {
    onPostSuccess(comment) {
      // 1.拿到评论列表数据
      const commentList = this.$refs.commentList.list
      // 2.将发布的新评论对象添加到评论列表中
      commentList.unshift(comment)
      // 更新回复的总数量
      this.replyComment.reply_count++
      // 3.让弹出层消失
      this.isShowPostComment = false
    }
  }
}
</script>

<style lang="less" scoped>
.article-bottom {
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 200px;
    height: 30px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
}
</style>
