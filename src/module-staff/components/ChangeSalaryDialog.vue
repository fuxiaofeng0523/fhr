<template>
  <el-dialog
    v-model="dialogVisible"
    title="调薪">
    <el-form
      v-if="dialogVisible"
      ref="ruleFormRef"
      :rules="rules"
      :inline="true"
      :model="changeSalaryForm"
      :label-width="formLabelWidth"
      label-suffix=":">
      <!-- 员工 -->
      <el-form-item
        :label="$t('staff.name')"
        :label-width="formLabelWidth"
        prop="name">
        <el-input
          v-model="changeSalaryForm.name"
          :disabled="true" />
      </el-form-item>
      <!-- 原因 -->
      <el-form-item
        :label="$t('changeSalary.reason')"
        prop="reason">
        <el-input
          v-model="changeSalaryForm.reason"
          clearable
          autocomplete="off" />
      </el-form-item>
      <!-- 调薪前工资 -->
      <el-form-item :label="$t('changeSalary.beforeSalary')">
        <span class="item-span">
          {{ changeSalaryForm.beforeSalary }}
        </span>
      </el-form-item>
      <!-- 调薪后工资 -->
      <el-form-item
        :label="$t('changeSalary.afterSalary')"
        prop="afterSalary">
        <el-input
          v-model.number="changeSalaryForm.afterSalary"
          clearable
          autocomplete="off" />
      </el-form-item>

      <!-- 备注 -->
      <el-form-item :label="$t('changeSalary.remark')">
        <el-input
          v-model="changeSalaryForm.remark"
          clearable
          :rows="2"
          type="textarea"
          autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelHandler">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button
        type="primary"
        @click="confirmHandler(ruleFormRef)">
        {{ $t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import useStore from '@/store'
import type { FormInstance, FormRules } from 'element-plus'
import { initData } from '@/utils'
import { validateNumber } from '@/utils/validate'
const { changeSalaryStore } = useStore()
// 表单数据
const defalutChangeSalary = {
  staffId: null,
  beforeSalary: null,
  afterSalary: null,
  reason: null,
  remark: null,
  name: null
}
const changeSalaryForm = ref({
  ...(defalutChangeSalary as any)
})

// 表单验证
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  reason: [{ required: true, message: '请输入原因', trigger: 'blur' }],
  afterSalary: [
    { required: true, message: '请输入调薪后工资', trigger: 'blur' },
    { validator: validateNumber, trigger: 'blur' }
  ]
})
// 表单校验方法
const verification = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const result = await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
  return result
}
// 对话页面的显示与隐藏
const dialogVisible = ref<boolean>(false)
// 监听dialogVisible状态，如果为false清空数据
watch(dialogVisible, newVal => {
  !newVal && initData(changeSalaryForm, defalutChangeSalary as any)
})
const changeShowDialog = (
  staffId: number,
  name: string,
  beforeSalary: number
) => {
  changeSalaryForm.value.staffId = staffId
  changeSalaryForm.value.name = name
  changeSalaryForm.value.beforeSalary = beforeSalary
  dialogVisible.value = !dialogVisible.value
}
// 取消按钮事件
const cancelHandler = () => {
  dialogVisible.value = !dialogVisible.value
}
// 确定按钮事件
const confirmHandler = async (formEl: FormInstance | undefined) => {
  const flag = await verification(formEl)
  if (flag) {
    const { name, beforeSalary, ...rest } = changeSalaryForm.value
    changeSalaryStore.createChangeSalary({
      ...rest,
      beforeSalary: +beforeSalary
    })
    dialogVisible.value = !dialogVisible.value
  }
}
const formLabelWidth = '130px'

defineExpose({
  changeShowDialog
})
</script>

<style lang="less" scoped>
.el-input,
.el-select,
.item-span,
:deep(.el-date-editor),
:deep(.el-input__wrapper) {
  width: 180px;
}
</style>
