<template>
  <div class="edit-profile">
    <!--导航栏-->
    <!-- accept 指定接收文件的类型-->
    <input
      type="file"
      hidden
      ref="file"
      accept="image/*"
      @change="onFileChange"
    />
    <van-nav-bar title="个人信息" left-arrow @click-left="$router.back()" />
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image width="30" height="30" :src="user.photo" round fit="cover" />
    </van-cell>
    <van-cell
      center
      title="昵称"
      is-link
      :value="user.name"
      @click="isShowUpdataNamePop = true"
    />
    <van-cell
      center
      title="性别"
      is-link
      :value="user.gender === 0 ? '男' : '女'"
      @click="isShowUpdataGenderPop = true"
    />
    <van-cell
      center
      title="生日"
      is-link
      :value="user.birthday"
      @click="isShowUpdataBirthdayPop = true"
    />

    <!--修改用户名弹出层-->
    <van-popup
      v-model="isShowUpdataNamePop"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- v-model='user.name' 默认传递向子组件传递 :value='user.name' 默认监听input事件 @input='user.name = $event'还可以使用.sync修饰符 比如这里父组件 :title.sync=''  子组件接收title的值 子组件发自定义事件固定语法this.$emit('update:title', newTitle)
    -->
      <updata-name
        v-if="isShowUpdataNamePop"
        @close="isShowUpdataNamePop = false"
        v-model="user.name"
      />
    </van-popup>

    <!--修改性别弹出层-->
    <van-popup v-model="isShowUpdataGenderPop" position="bottom">
      <updata-gender
        v-if="isShowUpdataGenderPop"
        @close="isShowUpdataGenderPop = false"
        v-model="user.gender"
      />
    </van-popup>

    <!--修改生日弹出层-->
    <van-popup v-model="isShowUpdataBirthdayPop" position="bottom">
      <updata-birthday
        v-if="isShowUpdataBirthdayPop"
        @close="isShowUpdataBirthdayPop = false"
        v-model="user.birthday"
      />
    </van-popup>

    <!--修改头像弹出层-->
    <van-popup
      v-model="isShowPhotoPop"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <updata-photo
        v-if="isShowPhotoPop"
        @close="isShowPhotoPop = false"
        v-model="user.birthday"
        :file="previewImageFile"
        @updata-photo="user.photo = $event"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/network/user'

import UpdataName from './components/UpdataName'
import UpdataGender from './components/UpdataGender'
import UpdataBirthday from './components/UpdataBirthday'
import UpdataPhoto from './components/UpdataPhoto'

export default {
  name: 'EditProfile',
  created() {
    this.loadUserProfile()
  },
  data() {
    return {
      user: {},
      isShowUpdataNamePop: false,
      isShowUpdataGenderPop: false,
      isShowUpdataBirthdayPop: false,
      isShowPhotoPop: false,
      previewImageFile: '' // 预览图片文件对象
    }
  },
  methods: {
    async loadUserProfile() {
      const { data } = await getUserProfile()
      this.user = data.data
    },
    onFileChange() {
      // 获取预览图片路径
      const file = this.$refs.file.files[0]
      this.previewImageFile = file
      // 展示修改头像弹出层
      this.isShowPhotoPop = true
      // 解决选择相同文件不触发change事件
      this.$refs.file.value = ''
    }
  },
  components: {
    UpdataName,
    UpdataGender,
    UpdataBirthday,
    UpdataPhoto
  }
}
</script>

<style lang="less" scoped>
.van-popup {
  background-color: #f5f7f9;
}
</style>
