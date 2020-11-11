<template>
  <div class="profile">
    <van-cell-group class="my-info" v-if="user">
      <van-cell center class="base-info" :border="false">
        <van-image
          class="avatar"
          slot="icon"
          fit="cover"
          round
          :src="CurrentUserInfo.photo"
        />
        <div slot="title" class="name">{{ CurrentUserInfo.name }}</div>
        <van-button
          slot="default"
          size="small"
          round
          class="bianji-btn"
          to="/editProfile"
          >编辑资料</van-button
        >
      </van-cell>

      <van-grid :border="false" class="data-info">
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="count">{{ CurrentUserInfo.art_count }}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="count">{{ CurrentUserInfo.follow_count }}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="count">{{ CurrentUserInfo.fans_count }}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="count">{{ CurrentUserInfo.like_count }}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <div class="not-login" v-else>
      <img
        class="mobile"
        src="@/assets/img/手机.png"
        @click="
          $router.push({
            path: '/login',
            query: {
              redirect: '/profile'
            }
          })
        "
      />
      <div class="text">点击登录</div>
    </div>

    <van-grid :column-num="2" class="nav mb-4">
      <van-grid-item
        icon-prefix="toutiao"
        icon="shoucang"
        text="收藏"
        class="nav-item"
      />
      <van-grid-item
        icon-prefix="toutiao"
        icon="lishi"
        text="历史"
        class="nav-item"
      />
    </van-grid>

    <van-cell title="消息通知" is-link to="" />
    <van-cell title="小智同学" is-link @click="goUserChat" class="mb-4" />
    <van-cell
      v-if="user"
      title="退出登录"
      to=""
      class="login-out-cell"
      @click="onLoginOut"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/network/user'
export default {
  data() {
    return {
      // 存储当前用户信息
      CurrentUserInfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    onLoginOut() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确认退出?'
        })
        .then(() => {
          // on confirm
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
        })
    },
    async getCurrentUserInfo() {
      const { data } = await getUserInfo()
      this.CurrentUserInfo = data.data
    },
    goUserChat() {
      this.$router.push({ path: '/userChat' }).catch(() => {})
    }
  },
  created() {
    this.getCurrentUserInfo()
  }
}
</script>

<style scoped lang='less'>
/**
/deep/ | ::v-deep | >>>(less,sass不支持)： .vue文件中的特有语法
它可以让父组件中的样式 作用到子组件更深层次的元素(默认只能作用到子组件的根元素)
*/

.my-info {
  background: url('~@/assets/img/banner.png') no-repeat;
  background-size: cover;
  .base-info {
    padding-top: 38px;
    padding-bottom: 11px;
    height: 115px;
    background-color: unset;
    .avatar {
      width: 66px;
      height: 66px;
      border: 1px solid #fff;
      margin-right: 11px;
    }
    .name {
      font-size: 15px;
      color: #fff;
    }
    .bianji-btn {
      height: 16px;
      font-size: 10px;
      color: #666;
    }
  }
  .data-info {
    .data-info-item {
      height: 65px;
      color: #fff;
      text-align: center;
      .count {
        font-size: 18px;
        margin-bottom: 3px;
      }
      .text {
        font-size: 11px;
      }
    }
  }
  /deep/ .van-grid-item__content {
    background-color: unset;
  }
}
/deep/ .nav {
  .nav-item {
    height: 70px;
    .toutiao {
      font-size: 22px;
    }
    .toutiao-shoucang {
      color: #eb5253;
    }
    .toutiao-lishi {
      color: #ff9d1d;
    }
    .van-grid-item__text {
      font-size: 14px;
      color: #333;
    }
  }
}
.login-out-cell {
  text-align: center;
  color: #d86262;
}
.mb-4 {
  margin-bottom: 4px;
}
.not-login {
  height: 180px;
  background: url('~@/assets/img/banner.png') no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .mobile {
    width: 66px;
    height: 66px;
    margin-bottom: 5px;
  }
  .text {
    font-size: 14px;
    color: #fff;
  }
}
</style>
