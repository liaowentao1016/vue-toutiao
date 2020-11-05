<template>
  <div class="home">
    <!--导航栏-->
    <van-nav-bar>
      <van-button
        slot="title"
        icon="search"
        type="info"
        class="search-btn"
        round
        to="/search"
      >
        搜索
      </van-button>
    </van-nav-bar>

    <!--文章频道列表-->
    <van-tabs v-model="active" swipeable class="channels-tab">
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <!--每个频道对应一个文章列表-->
        <article-list :channel="item" />
      </van-tab>

      <!--占位div 为了不让图标遮挡tab标签-->
      <div slot="nav-right" class="placehodel van-tab"></div>
      <!--汉堡图标-->
      <div slot="nav-right" class="wap-nav" @click="show = true">
        <van-icon name="wap-nav"></van-icon>
      </div>
    </van-tabs>

    <!--弹出层-->
    <van-popup
      v-model="show"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      get-container="body"
    >
      <!--频道编辑组件 在模板中$event就是自定义事件传递的参数-->
      <channel-edit
        :channels="channels"
        @close="show = false"
        @updataChannel="active = $event"
        :active="active"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/network/user'

import ArticleList from './components/ArticleList'
import channelEdit from './components/ChannelEdit'

import { mapState } from 'vuex'

import { getItem } from '@/util/storage'

export default {
  data() {
    return {
      active: 0,
      channels: [], // 文章频道列表
      show: false // 控制弹出层的显示与隐藏
    }
  },
  created() {
    this.loadUserChannels()
  },
  methods: {
    // 发送请求 获取文章频道列表
    // async getUserChannels() {
    //   const { data } = await getUserChannels()
    //   this.channels = data.data.channels
    // }
    // 正确获取首页频道列表的数据
    //  if(已登录){
    //    发送请求获取该用户频道列表
    // }else(未登录){
    //   if(本地存储中有数据){
    //     获取本地存储的数据
    //   }else{
    //     发送请求获取后端返回的默认的频道列表
    //   }
    // }
    async loadUserChannels() {
      if (this.user) {
        const { data } = await getUserChannels()
        this.channels = data.data.channels
      } else {
        const localStorage = getItem('user-channels')
        if (localStorage) {
          this.channels = localStorage
        } else {
          // 获取默认的频道列表
          const { data } = await getUserChannels()
          this.channels = data.data.channels
        }
      }
    }
  },
  components: {
    ArticleList,
    channelEdit
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style scoped lang='less'>
/deep/.van-nav-bar__title {
  max-width: none;
}
.search-btn {
  width: 277px;
  height: 32px;
  background-color: #5babfb;
  border: none;
  .van-icon {
    font-size: 16px;
  }
  .van-button__text {
    font-size: 14px;
  }
}
.channels-tab {
  position: relative;
  /deep/ .van-tab {
    border-right: 1px solid #edeff3;
    border-bottom: 1px solid #edeff3;
  }
  /deep/ .van-tabs__line {
    background-color: #3296fa;
  }
  .placehodel {
    width: 33px;
    flex-shrink: 0;
  }
}

.wap-nav {
  position: fixed;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 33px;
  height: 43px;
  background-color: rgba(255, 255, 255, 0.9);
  .van-icon-wap-nav {
    font-size: 24px;
  }
}
</style>
