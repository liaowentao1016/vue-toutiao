<template>
  <div class="article">
    <van-nav-bar title="文章详情" left-arrow @click-left="$router.back()" />
    <h2 class="title">123456789635412</h2>
    <van-cell center class="user-info">
      <div slot="title" class="name">天涯明月刀</div>
      <div slot="label" class="pubdate">14小时前</div>
      <van-image
        class="avatar"
        slot="icon"
        round
        fit="cover"
        src="https://img.yzcdn.cn/vant/cat.jpeg"
      />
      <van-button size="mini" round type="info" icon="plus" class="btn"
        >关注</van-button
      >
    </van-cell>
  </div>
</template>

<script>
/**
 * 在组件中获取动态路由参数
 * 方式一：this.$route.params.xxx
 * 方式二：props传参 (推荐)
 */
import { getArticleDetail } from '@/network/article'

export default {
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  methods: {
    async getDetail() {
      // 由于该ID数字过大 超出了js的安全整数范围js无法解析
      // 解决方案：npm install json-bigint
      //  json-bigint会把超出js安全整数范围的数字转为一种类型为BigNumber的对象
      // 我们在使用的时候转成字符串来使用 BigNumber.toString()
      const { data } = await getArticleDetail(this.articleId)
      console.log(data)
    }
  },
  created() {
    this.getDetail()
  }
}
</script>

<style lang="less" scoped>
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
</style>
