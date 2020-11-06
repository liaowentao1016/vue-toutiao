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
        @focus="isShowResult = false"
      />
    </form>

    <!--搜索结果-->
    <result v-if="isShowResult" :search-text="searchText" />
    <!--联想建议-->
    <suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!--历史记录 $event是自定义事件传递的参数-->
    <history
      v-else
      :histories="histories"
      @search="onSearch"
      @delete-all-history="histories = $event"
    />
  </div>
</template>

<script>
import Suggestion from './components/Suggestion'
import History from './components/History'
import Result from './components/Result'

// import { getSearchHistories } from '@/network/search'

import { getItem, setItem } from '@/util/storage'

import { mapState } from 'vuex'

export default {
  name: 'Search',
  data() {
    return {
      searchText: '',
      isShowResult: false, // 控制搜索结果的显示或隐藏
      histories: getItem('histories') || [] // 历史记录
    }
  },
  methods: {
    onSearch(searchParams) {
      this.searchText = searchParams
      // 将搜索项添加至历史记录
      const index = this.histories.indexOf(this.searchText)
      if (index !== -1) {
        // 将重复的历史记录删除
        this.histories.splice(index, 1)
      }
      this.histories.unshift(this.searchText)
      // console.log(this.histories)
      // 将历史记录存在本地
      // setItem('histories', this.histories)

      // 展示搜索结果
      this.isShowResult = true
    }
    // 加载搜索历史
    // async loadHistories() {
    //   let localHistories = getItem('histories') || []

    //   if (this.user) {
    //     // 登录状态
    //     const { data } = await getSearchHistories()

    //     const onLineHistories = data.data.keywords || []
    //     // 因为线上返回的历史记录只有4条数据不够 为了让数据更真实这里需要和本地的历史记录合并并去重
    //     localHistories = [...new Set([...localHistories, ...onLineHistories])]
    //   }

    //   this.histories = localHistories
    // }
  },
  components: {
    Suggestion,
    History,
    Result
  },
  // created() {
  //   this.loadHistories()
  // },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    histories(newValue, oldValue) {
      setItem('histories', newValue)
    }
  }
}
</script>

<style lang="less" scoped>
.van-search__action {
  color: #fff;
}
</style>
