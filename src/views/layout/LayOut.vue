<template>
  <div>
    <keep-alive>
      <router-view />
    </keep-alive>

    <!--底部TabBar组件-->
    <van-tabbar v-model="active" route>
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/question" icon="comment-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item v-if="user" to="/profile" icon="manager-o"
        >我的</van-tabbar-item
      >
      <van-tabbar-item v-else to="/profile" icon="manager-o"
        >未登录</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'LayOut',
  data() {
    return {
      active: 0
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    // 添加需要缓存的组件
    this.$store.commit('addCacheComponent', 'LayOut')
  }
}
</script>

<style scoped>
</style>
