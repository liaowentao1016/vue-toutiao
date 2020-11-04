<template>
  <div class="channer-edit">
    <div class="mychannel">
      <van-cell :border="false" center>
        <div slot="title" class="title">我的频道</div>
        <van-button
          slot="default"
          type="danger"
          size="mini"
          plain
          round
          class="btn"
          @click="isEdit = !isEdit"
          >{{ isEdit ? '完成' : '编辑' }}</van-button
        >
      </van-cell>
      <van-grid :gutter="10">
        <van-grid-item
          v-for="(item, index) in channels"
          :key="index"
          :text="item.name"
          class="grid-item"
          :class="{ active: index === active }"
          :icon="isEdit && index !== 0 ? 'close' : ''"
          @click="onUserChangeClick(item, index)"
        />
      </van-grid>
    </div>

    <div class="tuijian">
      <van-cell :border="false">
        <div slot="title" class="title">频道推荐</div>
      </van-cell>
      <van-grid :gutter="10">
        <van-grid-item
          v-for="(item, index) in recommendChannel"
          :key="index"
          :text="item.name"
          class="grid-item"
          @click="onAdd(item)"
        />
      </van-grid>
    </div>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/network/channel'
import { mapState } from 'vuex'
import { setItem } from '@/util/storage'

export default {
  props: {
    // 我的频道数据
    channels: {
      type: Array,
      required: true
    },
    active: {
      type: Number
    }
  },
  data() {
    return {
      allChannels: [], // 所有频道列表数据
      isEdit: false // 控制编辑状态的显示与隐藏
    }
  },
  created() {
    this.loadAllChannels()
  },
  computed: {
    ...mapState(['user']),
    // 推荐频道数据列表 = 所有频道列表 - 我的频道列表
    recommendChannel() {
      //   return this.allChannels.filter(
      //     allitem => !this.channels.find(myitem => myitem.id === allitem.id)
      //   )
      return this.allChannels.filter(allItem => {
        return !this.channels.some(myItem => myItem.id === allItem.id)
      })
    }
  },
  methods: {
    async loadAllChannels() {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    async onAdd(item) {
      this.channels.push(item)
      // 数据持久化
      if (this.user) {
        // 登录状态 储存在线上 id:添加频道的id , seq:频道添加的位置
        await addUserChannel({
          channels: [{ id: item.id, seq: this.channels.length }]
        })
      } else {
        // 未登录状态 储存在本地
        setItem('user-channels', this.channels)
      }
    },
    async onUserChangeClick(item, index) {
      if (this.isEdit && index !== 0) {
        // 如果删除的是激活频道之前的频道 更新激活频道的索引
        if (index <= this.active) {
          this.$emit('updataChannel', this.active - 1)
        }
        // 编辑状态点击删除
        this.channels.splice(index, 1)
        // 实现删除数据持久化
        if (this.user) {
          // 登录状态
          await deleteUserChannel(item.id)
        } else {
          // 未登录
          setItem('user-channels', this.channels)
        }
      } else {
        // 非编辑状态点击切换频道
        this.$emit('close') // 关闭弹框
        this.$emit('updataChannel', index) // 切换频道
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channer-edit {
  padding-top: 54px;
  .title {
    font-size: 16px;
    color: #333;
  }
  .btn {
    width: 44px;
    height: 20px;
  }
  .mychannel {
    margin-bottom: 30px;
  }
  .grid-item {
    position: relative;
    width: 80px;
    height: 43px;
    /deep/ .van-grid-item__content {
      background-color: #f4f5f6;
      padding: 0;
      .van-grid-item__text {
        margin-top: 0;
        font-size: 14px;
        color: #222;
      }
    }
    /deep/.van-icon {
      position: absolute;
      top: -5px;
      right: -5px;
      font-size: 18px;
      color: #999;
    }
  }
  .active {
    /deep/ .van-grid-item__text {
      color: red !important ;
    }
  }
}
</style>
