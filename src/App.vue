<template>
  <div id="app">
    <keep-alive :include="cacheComponents">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['cacheComponents'])
  }
}
</script>
<style lang="less">
@import url('./assets/css/base.css');
</style>
