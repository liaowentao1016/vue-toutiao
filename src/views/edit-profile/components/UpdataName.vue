<template>
  <div class="updata-name">
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />

    <div class="field-name-wrap">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { editUserProfile } from '@/network/user'
export default {
  props: {
    // 父组件v-model默认传递的值的名称为value
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      localName: this.value
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '修改中...',
        forbidclick: true // 禁止背景点击
      })
      try {
        // 发送请求 修改昵称
        await editUserProfile({ name: this.localName })
        // 更新成功 --> 修改父组件的name --> 关闭弹出层
        // this.$emit('updata-name', this.localName)
        this.$emit('input', this.localName)
        this.$emit('close')
        this.$toast.success('修改成功')
      } catch (error) {
        if (error.response.status === 409) {
          this.$toast.fail('昵称已存在')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.updata-name {
  .van-nav-bar {
    background-color: #fff !important;
    /deep/.van-nav-bar__title {
      color: #333 !important;
    }
  }
  .field-name-wrap {
    padding: 10px;
  }
}
</style>
