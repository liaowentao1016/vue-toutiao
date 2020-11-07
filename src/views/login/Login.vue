<template>
  <div>
    <!--导航栏-->
    <van-nav-bar title="登录 / 注册" left-arrow @click-left="$router.back()" />

    <!--登录表单-->
    <van-form
      @submit="onLoad"
      @failed="failed"
      validate-first
      :show-error="false"
      :show-error-message="false"
      ref="form"
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        placeholder="请输入手机号码"
        :rules="Rules.mobile"
        name="phone"
        center
      />
      <van-field
        v-model="user.code"
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        :rules="Rules.code"
        center
      >
        <template #button>
          <van-count-down
            :time="1000 * 60"
            format="ss s"
            @finish="isShowCountDown = false"
            v-if="isShowCountDown"
          />
          <van-button
            v-else
            size="mini"
            class="fasong"
            native-type="button"
            @click="onSend"
            :loading="isLoading"
            >获取验证码</van-button
          >
        </template>
      </van-field>

      <div class="loginBtnBox">
        <van-button type="info" size="large" class="login-btn">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/network/user'

export default {
  name: 'Login',
  data() {
    return {
      user: {
        mobile: '',
        code: '246810'
      },
      Rules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机格式不正确' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式不正确' }
        ]
      },
      isShowCountDown: false, // 控制倒计时组件的显示隐藏
      isLoading: false // 控制加载状态的显示与隐藏
    }
  },
  methods: {
    async onLoad() {
      // 1.找到数据接口
      // 2.封装请求方法
      // 3.请求调用登录
      // 4.处理请求结果
      // 万能验证码 246810
      this.$toast.loading({
        message: '登录中...',
        forbidClick: false, // 禁用背景点击
        duration: 0
      })

      try {
        const { data } = await login(this.user)
        this.$toast.success('登录成功')
        // 将用户信息(token)存放在仓库中
        this.$store.commit('setUser', data.data)
        // 登录成功 跳转会原来的页面
        this.$router.back()
      } catch (error) {
        this.$toast.fail('登录失败')
      }
    },
    // 表单验证失败
    failed(errInfo) {
      if (errInfo.errors[0]) {
        this.$toast({
          message: errInfo.errors[0].message,
          position: top
        })
      }
    },
    // 点击获取验证码
    async onSend() {
      // 只校验手机号
      try {
        // 验证手机号通过
        await this.$refs.form.validate('phone')

        // 显示Loading状态 防止用户多次点击 发送多次请求
        this.isLoading = true

        // 发送请求获取验证码
        await sendSms(this.user.mobile)

        // 显示倒计时组件
        this.isShowCountDown = true
      } catch (error) {
        let message = ''
        // try里面任何的错误都会进入catch 对于不同的错误需要有不同的提示
        if (error && error.response && error.response.status === 429) {
          // 发送短信失败的错误提示
          message = '发送太频繁了,请稍后重试'
        } else if (error.name === 'mobile') {
          // 表单验证失败的错误提示
          message = error.message
        } else {
          // 未知错误
          message = '发送失败,请稍后重试'
        }
        // 验证不通过 提示
        this.$toast({
          message,
          position: top
        })
      } finally {
        // 最后不管成功与否 Loading状态都要消失
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped lang='less'>
.loginBtnBox {
  padding: 26px 16px;
}
.login-btn {
  background-color: #6db4fb;
  border: none;
}
.fasong {
  width: 76px;
  height: 25px;
  background-color: #ededed;
  border-radius: 10px;
  .van-button__text {
    font-size: 11px;
    color: #666;
  }
}
</style>
