<template>
  <div class="article">
    <van-nav-bar title="文章详情" left-arrow @click-left="$router.back()" />
    <!--详情内容区域-->
    <div class="article-wrap">
      <h2 class="title">{{ articles.title }}</h2>
      <van-cell center class="user-info">
        <div slot="title" class="name">{{ articles.aut_name }}</div>
        <div slot="label" class="pubdate">
          {{ articles.pubdate | relativeTime }}
        </div>
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="articles.aut_photo"
        />
        <van-button
          size="mini"
          round
          :type="articles.is_followed ? 'default' : 'info'"
          :icon="articles.is_followed ? '' : 'plus'"
          class="btn"
          @click="onFollow"
          :loading="isShowFollowLoading"
          >{{ articles.is_followed ? '已关注' : '关注' }}</van-button
        >
      </van-cell>
      <div v-html="articles.content" class="markdown-body" ref="content"></div>
      <!--评论列表-->
      <comment-list
        :source="articleId"
        ref="commentList"
        @updata-total-count="totalCount = $event"
        @on-reply="onReply"
      ></comment-list>
    </div>
    <!--/详情内容区域-->

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isShowPop = true"
        >写评论</van-button
      >
      <van-icon name="comment-o" color="#777" :badge="totalCount" />
      <van-icon
        :color="articles.is_collected ? 'orange' : '#777'"
        :name="articles.is_collected ? 'star' : 'star-o'"
        @click="onCollect"
      />
      <van-icon
        :color="articles.attitude === 1 ? 'hotpink' : '#777'"
        :name="articles.attitude === 1 ? 'good-job' : 'good-job-o'"
        @click="onLike"
      />
      <van-icon name="share" color="#777777"></van-icon>
    </div>
    <!-- /底部区域 -->

    <!--评论弹出层-->
    <van-popup v-model="isShowPop" position="bottom">
      <post-comment :target="articleId" @post-success="postSuccess" />
    </van-popup>

    <!--回复评论弹出层-->
    <!--这里使用v-if的目的是为了让组件随着弹出层的显示与隐藏进行渲染或销毁，解决数据不会重新加载的问题-->
    <van-popup v-model="isShowReplyPop" position="bottom">
      <reply-comment
        v-if="isShowReplyPop"
        :replyComment="replyComment"
        :articleId="articleId"
        @close="isShowReplyPop = false"
      />
    </van-popup>
  </div>
</template>

<script>
import './github-markdown.css'
/**
 * 在组件中获取动态路由参数
 * 方式一：this.$route.params.xxx
 * 方式二：props传参 (推荐)
 */
import {
  getArticleDetail,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike
} from '@/network/article'
import { addFollow, deleteFollow } from '@/network/user'

import { ImagePreview } from 'vant'

import CommentList from './components/CommontList'
import PostComment from './components/PostComment'
import ReplyComment from './components/ReplyComment'

export default {
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data() {
    return {
      articles: {}, // 文章详情对象
      isShowFollowLoading: false, // 关注按钮的加载状态，加载过程中点击不会执行绑定事件
      isShowPop: false, // 文章评论弹出层的显示与隐藏
      totalCount: null, // 评论的总数量
      isShowReplyPop: false, // 评论回复弹出层的显示与隐藏
      replyComment: {} // 当前回复的评论对象
    }
  },
  methods: {
    async getDetail() {
      // 由于该ID数字过大 超出了js的安全整数范围js无法解析
      // 解决方案：npm install json-bigint
      //  json-bigint会把超出js安全整数范围的数字转为一种类型为BigNumber的对象
      // 我们在使用的时候转成字符串来使用 BigNumber.toString()
      const { data } = await getArticleDetail(this.articleId)
      this.articles = data.data
      // 这个位置DOM还未完成更新
      this.$nextTick(() => {
        // DOM更新完成
        this.handleImagePreview()
      })
    },
    handleImagePreview() {
      // 获取文章内容的DOM容器
      const articleContent = this.$refs.content
      // 获取容器中所有的img标签
      const imgs = articleContent.querySelectorAll('img')
      // 定义数组存储每个图片的路径
      const imgsPath = []
      // 给每个ing标签绑定点击事件
      imgs.forEach((img, index) => {
        // 将每张图片的路径添加至数组中
        imgsPath.push(img.src)
        img.onclick = function () {
          // 调用方法显示预览图片
          ImagePreview({
            images: imgsPath,
            startPosition: index, // 起始位置
            loop: false
          })
        }
      })
    },
    async onFollow() {
      this.isShowFollowLoading = true
      // 如果已关注 则点击取消关注 反之亦然
      if (this.articles.is_followed) {
        await deleteFollow(this.articles.aut_id)
      } else {
        await addFollow(this.articles.aut_id)
      }
      this.articles.is_followed = !this.articles.is_followed
      this.isShowFollowLoading = false
    },
    async onCollect() {
      this.$toast.loading({
        message: '处理中...',
        forbidClick: true // 禁止背景点击
      })
      // 如果已收藏 则点击取消收藏 反之亦然
      if (this.articles.is_collected) {
        await deleteCollect(this.articleId)
      } else {
        await addCollect(this.articleId)
      }
      this.articles.is_collected = !this.articles.is_collected
      this.$toast.success(`${this.articles.is_collected ? '' : '取消'}收藏成功`)
    },
    async onLike() {
      this.$toast.loading({
        message: '处理中...',
        forbidClick: true // 禁止背景点击
      })
      // 如果已点赞 则点击取消点赞 反之亦然
      if (this.articles.attitude === 1) {
        await deleteLike(this.articleId)
      } else {
        await addLike(this.articleId)
      }
      this.articles.attitude = this.articles.attitude === 1 ? -1 : 1
      this.$toast.success(
        `${this.articles.attitude === 1 ? '' : '取消'}点赞成功`
      )
    },
    postSuccess(comment) {
      // 1.拿到评论列表数据
      const commentList = this.$refs.commentList.list
      // 2.将发布的新评论对象添加到评论列表中
      commentList.unshift(comment)
      // 更新评论的总数量
      this.totalCount++
      // 3.让弹出层消失
      this.isShowPop = false
    },
    onReply(comment) {
      this.replyComment = comment
      this.isShowReplyPop = true
    }
  },
  created() {
    this.getDetail()
  },
  components: {
    CommentList,
    PostComment,
    ReplyComment
  }
}
</script>

<style lang="less" scoped>
.article-wrap {
  height: calc(100vh - 90px);
  overflow-y: auto;
}
.title {
  font-size: 20px;
  color: #3a3a3a;
  padding: 14px;
  background-color: #fff;
}
.user-info {
  .name {
    font-size: 12px;
    color: #333;
  }
  .pubdate {
    font-size: 11px;
    color: #b4b4b4;
  }
  .avatar {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  .btn {
    width: 85px;
    height: 29px;
  }
}
.markdown-body {
  padding: 14px;
  background-color: #fff;
}
.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 141px;
    height: 23px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
  .van-icon {
    font-size: 20px;
    .van-info {
      font-size: 11px;
      background-color: #e22829;
    }
  }
}
</style>
