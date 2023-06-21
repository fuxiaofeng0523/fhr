<template>
  <el-dialog
    v-model="dialogVisible"
    :title="type && $t(`common.${type}`)">
    <el-form
      v-if="dialogVisible"
      ref="ruleFormRef"
      :rules="rules"
      :inline="true"
      :model="transferForm"
      :label-width="formLabelWidth"
      label-suffix=":">
      <!-- 员工 -->
      <el-form-item
        :label="$t('staff.name')"
        prop="name">
        <el-input
          v-model="transferForm.name"
          :disabled="true" />
      </el-form-item>
      <!-- 原因 -->
      <el-form-item
        :label="$t('transfer.reason')"
        prop="reason">
        <el-input
          v-model="transferForm.reason"
          clearable
          autocomplete="off" />
      </el-form-item>
      <!-- 调动前部门 -->
      <el-form-item :label="$t('transfer.beforeDepartmentName')">
        <span class="item-span">
          {{ transferForm.beforeDepartmentId }}
        </span>
      </el-form-item>
      <!-- 调动后部门 -->
      <el-form-item
        :label="$t('transfer.afterDepartmentName')"
        prop="afterDepartmentId">
        <el-select
          v-model="transferForm.afterDepartmentId"
          clearable
          placeholder="请选择">
          <el-option
            v-for="department of departmentStore.departmentOption"
            :key="department.value"
            :label="department.label"
            :value="department.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- 调动前职位 -->
      <el-form-item :label="$t('transfer.beforeJobName')">
        <span class="item-span">
          {{ transferForm.beforeJobId }}
        </span>
      </el-form-item>
      <!-- 调动后职位 -->
      <el-form-item
        :label="$t('transfer.afterJobName')"
        :label-width="formLabelWidth"
        prop="afterJobId">
        <el-select
          v-model="transferForm.afterJobId"
          clearable
          :disabled="!transferForm.afterDepartmentId"
          placeholder="请选择">
          <el-option
            v-for="job in jobStore.jobOption"
            :key="job.value"
            :label="job.label"
            :value="job.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item :label="$t('transfer.remark')">
        <el-input
          v-model="transferForm.remark"
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
import { getValueByOptionData, initData } from '@/utils'
const { departmentStore, jobStore, transferStore, staffInfosStore } = useStore()
departmentStore.getDepartmentOption()

// 表单数据
const defalut = {
  staffId: null,
  beforeDepartmentId: null,
  afterDepartmentId: null,
  beforeJobId: null,
  afterJobId: null,
  reason: null,
  remark: null,
  name: null
}
const transferForm = ref({ ...(defalut as any) })

// 监听部门id，切换职位
watch(
  () => transferForm.value.afterDepartmentId,
  (newVal, oldVal) => {
    // 存在部门id时，获取该部门下的job
    if (+newVal !== 0 && !Number.isNaN(+newVal)) {
      jobStore.getJobOption(newVal)
    }
    // 有oldVal ---> 不是第一次监听到 ---> 不是切换编辑状态时 ---> jobId赋值为空
    oldVal && ((transferForm.value.afterJobId as any) = undefined)
  }
)
// 表单验证
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  reason: [{ required: true, message: '请输入原因', trigger: 'blur' }],
  afterDepartmentId: [
    { required: true, message: '请选择调动后部门', trigger: 'change' }
  ],
  afterJobId: [
    { required: true, message: '请选择调动后职位', trigger: 'change' }
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
  !newVal && initData(transferForm, defalut as any)
})
const type = ref<string>()
const changeShowDialog = (staff: Staff) => {
  transferForm.value.staffId = staff.id
  transferForm.value.name = staff.name
  transferForm.value.beforeDepartmentId = staff.department
  transferForm.value.beforeJobId = staff.job
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
    const { name, beforeDepartmentId, beforeJobId, ...rest } =
      transferForm.value
    await transferStore.createTransfer({
      ...rest,
      beforeDepartmentId: getValueByOptionData(
        beforeDepartmentId,
        departmentStore.departmentOption!
      ),
      beforeJobId: getValueByOptionData(beforeJobId, jobStore.jobOption)
    })
    await staffInfosStore.getStaff()
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
