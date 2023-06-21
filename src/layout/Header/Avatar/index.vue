<template>
  <el-dropdown>
    <el-avatar
      :size="40"
      :src="avatarUrl" />
    <template #dropdown>
      <el-dropdown-menu>
        <RouterLink to="/home">
          <el-dropdown-item>
            {{ appStore.userInfo?.name }}
          </el-dropdown-item>
        </RouterLink>
        <el-dropdown-item @click="changePWDDialog">修改密码</el-dropdown-item>
        <el-dropdown-item @click="changeInfoDialog">绑定信息</el-dropdown-item>
        <el-dropdown-item @click="changeAvatarDialog">
          修改头像
        </el-dropdown-item>
        <el-dropdown-item
          v-if="isAdmin"
          @click="changeRole">
          切换角色
        </el-dropdown-item>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <ModPWDDialog ref="modPWDDialog" />
  <ModInfoDialog ref="modInfoDialog" />
  <AvatarDialog ref="avatarDialog" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import useStore from '@/store'
import { storeToRefs } from 'pinia'
import ModPWDDialog from '@/components/ModPWDDialog.vue'
import ModInfoDialog from '@/components/ModInfoDialog.vue'
import AvatarDialog from '@/module-staffInfo/components/AvatarDialog.vue'
import { TABS_VALUE, TAB_VALUE } from '@/layout/utils/constant'
import { FASTDATA, FASTACTIVE } from '@/utils/constant'
const router = useRouter()
const { appStore } = useStore()
const { userInfo, isAdmin } = storeToRefs(appStore)
const avatarUrl = computed<string>(
  () => `${import.meta.env.VITE_IMG_URL}/${userInfo.value.avatar}`
)
// 获取modPWDDialog组件实例
const modPWDDialog = ref<InstanceType<typeof ModPWDDialog>>()
// 切换ModPWDDialog组件显示
const changePWDDialog = () => {
  modPWDDialog.value && modPWDDialog.value.chagneDialogVisible()
}
// 获取modInfoDialog组件实例
const modInfoDialog = ref<InstanceType<typeof ModInfoDialog>>()
// 切换ModInfoDialog组件显示
const changeInfoDialog = () => {
  modInfoDialog.value && modInfoDialog.value.chagneDialogVisible()
}
// 获取avatarDialog组件实例
const avatarDialog = ref<InstanceType<typeof AvatarDialog>>()
// 切换avatarDialog组件显示
const changeAvatarDialog = () => {
  avatarDialog.value && avatarDialog.value.chagneDialogVisible()
}
const changeRole = async () => {
  appStore.isAdminNow = !appStore.isAdminNow
  localStorage.setItem('isAdminNow', JSON.stringify(appStore.isAdminNow))
  appStore.getMenu()
  localStorage.removeItem(TAB_VALUE)
  localStorage.removeItem(TABS_VALUE)
  localStorage.removeItem(FASTDATA)
  localStorage.removeItem(FASTACTIVE)
  await router.replace('/home')
  window.history.go(0)
}

const logout = () => {
  appStore.logout()
  appStore.isLogin = false
  router.replace('/login')
}
</script>

<style lang="less" scoped></style>
