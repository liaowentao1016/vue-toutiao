<template>
  <div class="updata-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="请选择你的生日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { editUserProfile } from '@/network/user'

import dayjs from 'dayjs'

export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '修改中...',
        forbidclick: true // 禁止背景点击
      })
      const date = dayjs(this.currentDate).format('YYYY-MM-DD')
      // 发送请求 修改生日
      await editUserProfile({ birthday: date })
      // 更新成功 --> 修改父组件的name --> 关闭弹出层
      this.$emit('input', date)
      this.$emit('close')
      this.$toast.success('修改成功')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
