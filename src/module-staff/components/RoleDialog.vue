<template>
  <el-dialog
    v-model="dialogVisible"
    title="修改权限"
    style="width: 500px; text-align: center">
    <el-radio-group v-model="role">
      <el-radio
        v-for="role in roleStore.roleOption"
        :label="role.value">
        {{ role.label }}
      </el-radio>
    </el-radio-group>
    <template #footer>
      <el-button @click="changeShowDialog">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button
        type="primary"
        @click="submitHandler">
        {{ $t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useStore from '@/store'
const { staffInfosStore, roleStore, adminStore, appStore } = useStore()
roleStore.getRoleOption()
// dialog显示与隐藏
const dialogVisible = ref(false)
// 角色数据
const id = ref<number>()
const role = ref<number>()
// 改变显示与隐藏状态
const changeShowDialog = (paramsId?: number, paramsRole?: number) => {
  paramsId !== undefined && ((id.value = paramsId), (role.value = paramsRole))
  dialogVisible.value = !dialogVisible.value
}
// 提交事件
const submitHandler = async () => {
  if (staffInfosStore.editStaff?.role.flag === undefined) {
    await adminStore.updateAdminByStaffId(id.value!, { roleId: role.value! })
  } else {
    await adminStore.createAdmin({
      staffId: id.value!,
      roleId: role.value!,
      name: appStore.userInfo.name
    })
  }
  staffInfosStore.getStaff()
  changeShowDialog()
}
defineExpose({
  changeShowDialog
})
</script>

<style lang="less" scoped></style>
