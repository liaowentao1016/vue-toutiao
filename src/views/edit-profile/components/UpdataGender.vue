<template>
  <div class="updata-gender">
    <van-picker
      show-toolbar
      :columns="columns"
      :default-index="defaultIndex"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onGenderChange"
      title="性别"
    />
  </div>
</template>

<script>
import { editUserProfile } from '@/network/user'

export default {
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columns: ['男', '女'],
      defaultIndex: this.value
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '修改中...',
        forbidclick: true // 禁止背景点击
      })
      // 发送请求 修改性别
      await editUserProfile({ gender: this.defaultIndex })
      // 更新成功 --> 修改父组件的name --> 关闭弹出层
      this.$emit('input', this.defaultIndex)
      this.$emit('close')
      this.$toast.success('修改成功')
    },
    onGenderChange(picker, value, index) {
      this.defaultIndex = index
    }
  }
}
</script>

<style lang="less" scoped>
</style>
