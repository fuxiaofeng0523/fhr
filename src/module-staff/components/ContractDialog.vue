<template>
  <el-dialog
    v-model="dialogVisible"
    title="合同信息">
    <el-form
      v-if="dialogVisible"
      :inline="true"
      ref="ruleFormRef"
      :model="contractForm"
      :label-width="formLabelWidth"
      label-suffix=":">
      <el-form-item
        label="姓名"
        prop="name">
        <el-input v-model="contractForm.staff.name"></el-input>
      </el-form-item>
      <el-form-item
        label="部门"
        prop="department">
        <el-select v-model="contractForm.department.id">
          <el-option
            v-for="item of departmentStore.departmentOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="职位"
        prop="job">
        <el-select
          v-model="contractForm.job.id"
          :disabled="!contractForm.department.id">
          <el-option
            v-for="item of jobStore.jobOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="基本工资"
        prop="basisSalary">
        <el-input v-model="contractForm.staff.basisSalary"></el-input>
      </el-form-item>
      <el-form-item
        label="生效时间"
        prop="effectiveDate">
        <el-date-picker
          v-model="contractForm.effectiveDate"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss" />
        <!-- value-format="YYYY-MM-DD HH:mm:ss" -->
      </el-form-item>

      <el-form-item
        label="工作职责"
        prop="jobDescription">
        <el-input
          v-model="contractForm.jobDescription"
          type="textarea"
          style="width: 550px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        type="primary"
        @click="confirmHandler(ruleFormRef)">
        提交
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import useStore from '@/store'
import { getValueByOptionData, initData } from '@/utils'
import { FormInstance, FormRules } from 'element-plus'
import { ApplyStateEnum } from '@/enums/apply'
interface Emits {
  (e: 'confirm', state: number, flag: boolean): void
}
const { contractStore, appStore, applyStore, departmentStore, jobStore } =
  useStore()
const { userInfo } = appStore
const emit = defineEmits<Emits>()
const init = () => {
  departmentStore.getDepartmentOption()
}
init()
const defalutContract = {
  id: undefined,
  jobDescription: undefined,
  agreed: undefined,
  effectiveDate: undefined,
  sign: undefined,
  staff: {
    id: undefined,
    name: undefined,
    basisSalary: undefined
  },
  job: {
    id: undefined,
    name: undefined
  },
  department: {
    id: undefined,
    name: undefined
  }
}
const contractForm = ref<Contract>({ ...(defalutContract as any) })
// 监听department变化
watch(
  () => contractForm.value.department.id,
  async newVal => {
    if (newVal) {
      await jobStore.getJobOption(newVal)
    }
  }
)
const formLabelWidth = '120px'
// 表单验证
const ruleFormRef = ref<FormInstance>()
// const rules = reactive<FormRules>({
//   name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
//   department: [{ required: true, message: '请选择部门', trigger: 'change' }],
//   job: [{ required: true, message: '请选择职位', trigger: 'change' }],
//   basisSalary: [{ required: true, message: '请输入工资', trigger: 'blur' }],
//   effectiveDate: [
//     { required: true, message: '请选择生效时间', trigger: 'change' }
//   ],
//   jobDescription: [
//     { required: true, message: '请输入工作职责', trigger: 'blur' }
//   ]
// })
// 对话页面的显示与隐藏
const dialogVisible = ref<boolean>(false)
watch(dialogVisible, async newVal => {
  if (newVal) {
    contractForm.value.staff.id = userInfo.id
    contractForm.value.staff.name = userInfo.name
    contractForm.value.staff.basisSalary ??
      (contractForm.value.staff.basisSalary = userInfo.basisSalary)
    contractForm.value.department.id ??
      (contractForm.value.department.id = getValueByOptionData(
        userInfo.department,
        departmentStore.departmentOption!
      )!)
    contractForm.value.department.id &&
      jobStore.jobOption.length === 0 &&
      (await jobStore.getJobOption(contractForm.value.department.id))
    contractForm.value.job.id ??
      (contractForm.value.job.id = getValueByOptionData(
        userInfo.job,
        jobStore.jobOption!
      )!)
  } else {
    initData(contractForm, defalutContract as any)
  }
})
const changeShowDialog = async (data: {
  salary: string
  department: string
  job: string
}) => {
  contractForm.value.department.id = getValueByOptionData(
    data.department,
    departmentStore.departmentOption!
  )!
  jobStore.jobOption.length < 0 &&
    (await jobStore.getJobOption(contractForm.value.department.id))
  contractForm.value.job.id = getValueByOptionData(
    data.job,
    jobStore.jobOption!
  )!
  contractForm.value.staff.basisSalary = +data.salary
  dialogVisible.value = !dialogVisible.value
}

// 确定事件
const confirmHandler = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      contractStore.createContract({
        staffId: appStore.userInfo.id,
        effectiveDate: contractForm.value!.effectiveDate,
        sign: contractForm.value!.sign,
        jobDescription: contractForm.value!.jobDescription,
        agreed: false
      })
      emit('confirm', ApplyStateEnum['审核通过'], false)
      dialogVisible.value = false
    }
  })
}

defineExpose({
  dialogVisible,
  changeShowDialog
})
</script>

<style lang="less" scoped>
.el-input,
.el-date-picker,
:deep(.el-date-editor),
:deep(.el-input__wrapper) {
  width: 200px;
}
.sign {
  :deep(.el-form-item__content) {
    flex-direction: column;
    align-items: flex-end;
  }
}

canvas {
  border: 1px dashed #dcdfe6;
  width: 300px;
  height: 150px;
}
</style>
