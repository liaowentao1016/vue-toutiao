<template>
  <div class="search">
    <!--搜索栏-->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="$router.back()"
        background="#3296fa"
      />
    </form>

    <!--搜索结果-->
    <result v-if="isShowResult" />
    <!--联想建议-->
    <suggestion v-else-if="searchText" />
    <!--历史记录-->
    <history v-else />
  </div>
</template>

<script>
import Suggestion from './components/Suggestion'
import History from './components/History'
import Result from './components/Result'

export default {
  name: 'Search',
  data() {
    return {
      searchText: '',
      isShowResult: false // 控制搜索结果的显示或隐藏
    }
  },
  methods: {
    onSearch() {
      this.isShowResult = true
    }
  },
  components: {
    Suggestion,
    History,
    Result
  }
}
</script>

<style lang="less" scoped>
.van-search__action {
  color: #fff;
}
</style>
