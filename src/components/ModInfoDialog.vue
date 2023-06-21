<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('common.modInfo')"
    style="width: 500px">
    <el-form
      v-if="dialogVisible"
      ref="ruleFormRef"
      :rules="rules"
      :model="infoForm"
      label-width="100px">
      <el-form-item
        :label="$t('staff.phone')"
        prop="phone">
        <el-input
          v-model="infoForm.phone"
          :placeholder="$t('common.input_placeholder')" />
      </el-form-item>
      <el-form-item
        :label="$t('staff.email')"
        prop="email">
        <el-input
          v-model="infoForm.email"
          :placeholder="$t('common.input_placeholder')" />
      </el-form-item>
      <el-form-item
        :label="$t('staff.address')"
        prop="address">
        <el-input
          v-model="infoForm.address"
          :placeholder="$t('common.input_placeholder')" />
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
import { ref, reactive, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { storeToRefs } from 'pinia'
import useStore from '@/store'
const { staffInfoStore, staffInfosStore } = useStore()
const { staffInfo } = storeToRefs(staffInfoStore)
const dialogVisible = ref(false)
const chagneDialogVisible = () => {
  dialogVisible.value = !dialogVisible.value
}
const infoForm = ref({
  phone: '',
  email: '',
  address: ''
})

watch(staffInfo, (newVal, oldVal) => {
  if (newVal) {
    infoForm.value.phone = newVal.phone
    infoForm.value.email = newVal.email
    infoForm.value.address = newVal.address
  }
})

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
})
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      staffInfosStore.updateStaff(staffInfo.value!.id, infoForm.value)
      dialogVisible.value = false
    } else {
    }
  })
}
defineExpose({
  chagneDialogVisible
})
</script>
<style scoped></style>
