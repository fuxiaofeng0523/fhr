<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('common.modPWD')"
    style="width: 500px">
    <el-form
      v-if="dialogVisible"
      ref="ruleFormRef"
      :rules="rules"
      :model="password"
      label-width="100px">
      <el-form-item
        :label="$t('common.newPWD')"
        prop="newPWD">
        <el-input
          type="password"
          v-model="password.newPWD"
          :placeholder="$t('common.input_placeholder')"
          show-password />
      </el-form-item>
      <el-form-item
        :label="$t('common.reNewPWD')"
        prop="reNewPWD">
        <el-input
          type="password"
          v-model="password.reNewPWD"
          :placeholder="$t('common.input_placeholder')"
          show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="submitForm(ruleFormRef)">
          {{ $t('common.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import useStore from '@/store'
import { storeToRefs } from 'pinia'
const { staffInfoStore, appStore, staffInfosStore } = useStore()
const { staffInfo } = storeToRefs(staffInfoStore)
const dialogVisible = ref(false)
const chagneDialogVisible = () => {
  dialogVisible.value = !dialogVisible.value
}
const password = ref<{
  newPWD: string
  reNewPWD: string
}>({
  newPWD: '',
  reNewPWD: ''
})

const ruleFormRef = ref<FormInstance>()

const validatePWD = (rule: any, value: any, callback: any) => {
  if (value !== password.value.newPWD) {
    callback(new Error('两次输入密码不同'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  newPWD: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  reNewPWD: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePWD, trigger: 'blur' }
  ]
})
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      staffInfosStore.updateStaff(staffInfo.value!.id, {
        password: password.value.newPWD
      })
      appStore.logout()
      dialogVisible.value = false
    }
  })
}
defineExpose({
  chagneDialogVisible
})
</script>
<style scoped></style>
