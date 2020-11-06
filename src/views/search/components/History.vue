<template>
  <div>
    <van-cell title="搜索历史">
      <div v-if="isShowDelete">
        <span @click="$emit('delete-all-history', [])">全部删除</span>
        &emsp;
        <span @click="isShowDelete = false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isShowDelete = true" />
    </van-cell>
    <van-cell
      :title="history"
      v-for="(history, index) in histories"
      :key="index"
      @click="deleteHistory(history, index)"
    >
      <van-icon name="close" v-show="isShowDelete"></van-icon>
    </van-cell>
  </div>
</template>

<script>
/**
 * props数据如果是引用类型(数组、对象)可以这样修改如：props.uname = '' , props.push(123) ...
 * props接收任何类型的数据都不能重新赋值 xxx = xxx 如果想要这样 要交给父组件去处理
 */
import { setItem } from '@/util/storage'
export default {
  props: {
    histories: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isShowDelete: false
    }
  },
  methods: {
    deleteHistory(history, index) {
      if (this.isShowDelete) {
        // 删除状态
        // 没有删除单独历史记录的接口 在登录状态下删除不能持久化
        this.histories.splice(index, 1)
        // setItem('histories', this.histories)
        return
      }
      // 非删除状态点击历史记录
      this.$emit('search', history)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
