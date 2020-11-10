<template>
  <div class="updata-photo">
    <img :src="image" alt="" class="avatar" ref="image" />
    <van-nav-bar
      class="photo-nav-bar"
      left-text="取消"
      right-text="确认"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserPhoto } from '@/network/user'

import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  props: {
    file: {
      required: true
    }
  },
  data() {
    return {
      // 预览图片的url地址
      image: window.URL.createObjectURL(this.file),
      cropper: null // 裁切器实例
    }
  },
  methods: {
    onConfirm() {
      this.$toast.loading({
        message: '上传中...',
        forbidclick: true,
        duration: 0 // 持续展示loading直到网络请求成功
      })
      // 得到裁切之后的图片文件对象
      this.cropper.getCroppedCanvas().toBlob(async cropFile => {
        // 上传文件要求Content-Type为formdata数据对象
        const fd = new FormData()
        fd.append('photo', cropFile)
        // 发送请求上传图片
        await updateUserPhoto(fd)
        // 更新父组件中的头像
        this.$emit('updata-photo', URL.createObjectURL(cropFile))
        // 关闭弹出层
        this.$emit('close')
        // 提示用户
        this.$toast.success('上传成功')
      })
    }
  },
  mounted() {
    // 获取需要裁切的图片 DOM
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  }
}
</script>

<style lang="less" scoped>
.avatar {
  display: block;
  max-width: 100%;
}

.photo-nav-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff !important;
  /deep/.van-nav-bar__title {
    color: #333 !important;
  }
}
</style>
