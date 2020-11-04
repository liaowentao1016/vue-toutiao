<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  data() {
    return {
      scroll: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true
      })
    })
  },
  methods: {
    refresh() {
      this.scroll && this.scroll.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
