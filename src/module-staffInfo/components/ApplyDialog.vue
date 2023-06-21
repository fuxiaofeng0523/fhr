<template>
  <el-dialog
    v-model="dialogVisible"
    :title="type && $t(`common.${type}`)">
    <el-form
      v-if="dialogVisible"
      :inline="true"
      ref="ruleFormRef"
      :rules="rules"
      :model="applyForm"
      :label-width="formLabelWidth"
      label-suffix=":">
      <!-- 申请人-->
      <el-form-item
        :label="$t('apply.staffName')"
        prop="staffName">
        <span class="item-span">
          {{ spanForm.staffName }}
        </span>
      </el-form-item>
      <!-- 原因-->
      <el-form-item
        :label="$t('apply.reason')"
        prop="reason">
        <span
          v-if="!editable"
          class="item-span">
          {{ spanForm.reason }}
        </span>
        <el-select
          v-else
          :disabled="reapply || applyForm.state === ApplyStateEnum['审核中']"
          v-model="applyForm.reason"
          clearable>
          <el-option
            v-for="item of applyType"
            :key="item.value"
            :label="item.label"
            :value="item.label"></el-option>
        </el-select>
      </el-form-item>
      <!-- 工作状态-->
      <el-form-item
        :label="$t('apply.workStateName')"
        prop="workStateName">
        <span class="item-span">
          {{ spanForm.workStateName }}
        </span>
      </el-form-item>
      <!-- 详情-->
      <el-form-item
        :label="$t('apply.detail')"
        prop="detail">
        <span
          v-if="!editable"
          class="item-span">
          {{ spanForm.detail }}
        </span>
        <el-input
          v-else
          v-model="applyForm.detail" />
      </el-form-item>
      <!-- 调薪 --- 调薪前工资 -->
      <el-form-item
        v-if="applyForm.reason === ApplyTypeEnum['0']"
        :label="$t('changeSalary.beforeSalary')">
        <span class="item-span">
          {{ spanForm.beforeSalary }}
        </span>
      </el-form-item>
      <!-- 调薪 --- 调薪后工资 -->
      <el-form-item
        v-if="applyForm.reason === ApplyTypeEnum['0']"
        :label="$t('changeSalary.afterSalary')"
        prop="salary">
        <span
          v-if="!editable"
          class="item-span">
          {{ spanForm.salary }}
        </span>
        <el-input
          v-else
          v-model="applyForm.salary" />
      </el-form-item>
      <!-- 调动 --- 调动前部门 -->
      <el-form-item
        v-if="applyForm.reason === ApplyTypeEnum['1']"
        :label="$t('transfer.beforeDepartmentName')">
        <span class="item-span">
          {{ spanForm.beforeDepartment }}
        </span>
      </el-form-item>
      <!-- 调动 --- 调动后部门 -->
      <el-form-item
        v-if="applyForm.reason === ApplyTypeEnum['1']"
        :label="$t('transfer.afterDepartmentName')"
        prop="department">
        <span
          v-if="!editable"
          class="item-span">
          {{ spanForm.departmentId }}
        </span>
        <el-select
          v-else
          v-model="applyForm.departmentId"
          clearable>
          <el-option
            v-for="item of departmentStore.departmentOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- 调动 --- 调动前职位 -->
      <el-form-item
        v-if="applyForm.reason === ApplyTypeEnum['1']"
        :label="$t('transfer.beforeJobName')">
        <span class="item-span">
          {{ spanForm.beforeJob }}
        </span>
      </el-form-item>
      <!-- 调动 --- 调动后职位 -->
      <el-form-item
        v-if="applyForm.reason === ApplyTypeEnum['1']"
        :label="$t('transfer.afterJobName')"
        prop="job">
        <span
          v-if="!editable"
          class="item-span">
          {{ spanForm.jobId }}
        </span>
        <el-select
          v-else
          :disabled="!applyForm.departmentId"
          v-model="applyForm.jobId"
          clearable>
          <el-option
            v-for="item of jobStore.jobOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- 请假 --- 请假开始时间 -->
      <el-form-item
        v-if="applyForm.reason === ApplyTypeEnum['2']"
        label="请假开始时间"
        prop="start">
        <span
          v-if="!editable"
          class="item-span">
          {{ spanForm.start }}
        </span>
        <el-date-picker
          v-else
          v-model="applyForm.start"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>
      <!-- 请假 --- 请假结束时间 -->
      <el-form-item
        v-if="applyForm.reason === ApplyTypeEnum['2']"
        label="请假结束时间"
        prop="end">
        <span
          v-if="!editable"
          class="item-span">
          {{ spanForm.end }}
        </span>
        <el-date-picker
          v-else
          v-model="applyForm.end"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>
      <!-- 申请时间-->
      <el-form-item
        :label="$t('apply.applyDate')"
        prop="applyDate"
        v-if="visible">
        <span class="item-span">
          {{ spanForm.applyDate }}
        </span>
      </el-form-item>
      <!-- 处理人 -->
      <el-form-item
        v-if="visible"
        :label="$t('apply.adminName')"
        prop="adminName">
        <span class="item-span">
          {{ spanForm.adminName }}
        </span>
      </el-form-item>
      <!-- 处理时间 -->
      <el-form-item
        v-if="visible"
        :label="$t('apply.verifyDate')"
        prop="verifyDate">
        <span class="item-span">
          {{ spanForm.verifyDate }}
        </span>
      </el-form-item>
      <!-- 审核状态 -->
      <el-form-item
        :label="$t('apply.state')"
        prop="state"
        v-if="visible">
        <span class="item-span">
          {{ ApplyStateEnum[spanForm.state] }}
        </span>
      </el-form-item>
      <!-- 意见 -->
      <el-form-item
        :label="$t('apply.opinion')"
        prop="opinion"
        v-if="visible">
        <span class="item-span">
          {{ spanForm.opinion }}
        </span>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelHandler">
        {{ cancelText }}
      </el-button>
      <el-button
        v-if="
          applyForm.state !== ApplyStateEnum['审核通过'] &&
          applyForm.state !== ApplyStateEnum['审核未通过']
        "
        type="primary"
        @click="confirmHandler(ruleFormRef)">
        {{ confirmText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive, getCurrentInstance, computed } from 'vue'
import useStore from '@/store'
import { FormRules, FormInstance } from 'element-plus'
import { storeToRefs } from 'pinia'
import { ADD, DETAIL, EDIT } from '@/utils/constant'
import { ApplyStateEnum, ApplyTypeEnum } from '@/enums/apply'
import {
  formatEnumData,
  getLabelByOptionData,
  getValueByOptionData,
  initData
} from '@/utils/index'
const proxy = getCurrentInstance()!
const {
  applyStore,
  appStore,
  workStateStore,
  departmentStore,
  jobStore,
  staffInfoStore
} = useStore()
const { editApply } = storeToRefs(applyStore)
// 表单数据
const defalutTransfer = {
  id: null,
  state: null,
  staffName: null,
  reason: null,
  detail: null,
  workStateName: null,
  applyDate: null,
  verifyDate: null,
  adminName: null,
  opinion: null,
  salary: null,
  departmentId: null,
  jobId: null,
  beforeSalary: null,
  beforeDepartment: null,
  beforeJob: null,
  reapply: null,
  start: null,
  end: null
}
const applyForm = ref({ ...(defalutTransfer as any) })
const spanForm = ref({ ...(defalutTransfer as any) })
watch(
  () => editApply.value,
  newVal => {
    newVal && ((applyForm.value = newVal), (spanForm.value = { ...newVal }))
  }
)

// 对话页面的显示与隐藏
const dialogVisible = ref<boolean>(false)
// 监听dialogVisible状态，如果为false清空数据
watch(dialogVisible, newVal => {
  if (!newVal) {
    initData(applyForm, defalutTransfer as any), (editApply.value = undefined)
  } else {
    spanForm.value.staffName = appStore.userInfo.name
    spanForm.value.workStateName = appStore.userInfo.workState
    if (editApply.value) {
      if (editApply.value.reason === ApplyTypeEnum['0']) {
        const salary = editApply.value.content.split('调整为')[1].slice(1, -1)
        spanForm.value.salary = salary
        applyForm.value.salary = salary
      } else if (editApply.value.reason === ApplyTypeEnum['1']) {
        const after = editApply.value.content.split('调整为')[1].split(',')
        spanForm.value.departmentId = after[0].slice(1)
        spanForm.value.jobId = after[1].slice(0, -1)
        applyForm.value.departmentId = after[0].slice(1)
        applyForm.value.jobId = after[1].slice(0, -1)
      } else if (editApply.value.reason === ApplyTypeEnum['2']) {
        const date = editApply.value.content.split('到')
        const start = date[0].split('(')[1].slice(0, -1)
        const end = date[1].split('(')[1].slice(0, -1)
        spanForm.value.start = start
        spanForm.value.end = end
        applyForm.value.start = start
        applyForm.value.end = end
      }
    }
  }
})
const type = ref<string>()
const reapply = ref<boolean>(false)
const changeShowDialog = (key: string, reapply2: boolean) => {
  type.value = key
  reapply.value = reapply2
  dialogVisible.value = !dialogVisible.value
}

// 申请类型
const applyType = computed(() => formatEnumData(ApplyTypeEnum))
// 监听申请类型
watch(
  () => applyForm.value.reason,
  async (newVal, oldValue) => {
    if (newVal === ApplyTypeEnum['1']) {
      await departmentStore.getDepartmentOption()
      spanForm.value.beforeDepartment = appStore.userInfo.department
      spanForm.value.beforeJob = appStore.userInfo.job
    } else if (newVal === ApplyTypeEnum['0']) {
      spanForm.value.beforeSalary = appStore.userInfo.basisSalary
    }
  }
)
// 监听部门
watch(
  () => applyForm.value.departmentId,
  async (newVal, oldValue) => {
    if (newVal) await jobStore.getJobOption(newVal)
    else applyForm.value.jobId = undefined
  }
)
const ruleFormRef = ref<FormInstance>()
const validateEndTime = (rule: any, value: any, callback: any) => {
  if (value < applyForm.value.start) {
    callback(new Error('结束时间不能小于开始时间'))
  } else {
    callback()
  }
}
// 表单校验方法
const verification = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  return await formEl.validate()
}
// 表单验证
const rules = reactive<FormRules>({
  detail: [
    { required: true, message: '详情不能为空', trigger: 'blur' },
    {
      max: 50,
      message: '最多输入50个字符',
      trigger: 'blur'
    }
  ],
  reason: [
    { required: true, message: '原因不能为空', trigger: 'blur' },
    {
      max: 30,
      message: '最多输入30个字符',
      trigger: 'blur'
    }
  ],
  salary: [{ required: true, message: '调薪后工资不能为空', trigger: 'blur' }],
  department: [
    { required: true, message: '调动后部门不能为空', trigger: 'change' }
  ],
  job: [{ required: true, message: '调动后职位不能为空', trigger: 'change' }],
  start: [
    { required: true, message: '请假开始时间不能为空', trigger: 'change' }
  ],
  end: [
    { required: true, message: '请假结束时间不能为空', trigger: 'change' },
    { validator: validateEndTime, trigger: 'change' }
  ]
})
// 取消按钮文字
const cancelText = computed(() =>
  proxy?.appContext.config.globalProperties.$t(
    editable.value ? 'common.cancel' : 'common.close'
  )
)
// 确定按钮文字
const confirmText = computed(() =>
  proxy?.appContext.config.globalProperties.$t(
    editable.value ? 'common.confirm' : 'common.edit'
  )
)

// 取消按钮事件
const cancelHandler = () => {
  // 如果是可编辑状态
  if (editable.value) {
    // 如果可见 ---> 编辑
    if (visible.value) {
      // 退出编辑状态
      type.value = DETAIL
    } else {
      // 不可见 ---> 添加
      // 隐藏界面
      dialogVisible.value = false
    }
  } else {
    // 隐藏界面
    dialogVisible.value = false
  }
}

// 确定按钮事件
const confirmHandler = async (formEl: FormInstance | undefined) => {
  // 如果是可编辑状态 --->  添加和编辑
  if (editable.value) {
    // 确定按钮提交事件
    // 如果可见 ---> 编辑
    const flag = await verification(formEl)
    if (flag) {
      let content = ''
      if (applyForm.value.reason === ApplyTypeEnum['0']) {
        content = `(${spanForm.value.beforeSalary})调整为(${applyForm.value.salary})`
      } else if (applyForm.value.reason === ApplyTypeEnum['1']) {
        content = `(${spanForm.value.beforeDepartment},${
          spanForm.value.beforeJob
        })调整为(${getLabelByOptionData(
          +applyForm.value.departmentId,
          departmentStore.departmentOption!
        )},${getLabelByOptionData(
          +applyForm.value.jobId,
          jobStore.jobOption!
        )})`
      } else if (applyForm.value.reason === ApplyTypeEnum['2']) {
        content = `请假时间为从(${applyForm.value.start})到(${applyForm.value.end})`
      }
      if (visible.value) {
        // 提交编辑
        applyStore.updateApply(applyForm.value.id, {
          reason: applyForm.value.reason,
          detail: applyForm.value.detail,
          content
        })
      } else {
        // 不可见 ---> 添加
        // 提交添加
        await workStateStore.getWorkStateOption()
        if (reapply.value) {
          applyStore.updateApply(applyForm.value.id, {
            reapply: reapply.value
          })
        }
        await applyStore.createApply(
          {
            reason: applyForm.value.reason,
            detail: applyForm.value.detail,
            staffId: appStore.userInfo.id,
            content,
            workStateId: getValueByOptionData(
              spanForm.value.workStateName,
              workStateStore.workStateOption!
            )!
          },
          false
        )
        await staffInfoStore.getApplyByStaffId(appStore.userInfo.id)
      }
      dialogVisible.value = false
    }
  } else {
    // 不是可编辑状态 ---> 详情
    type.value = EDIT
  }
}
const formLabelWidth = '130px'

// 是否可见
const visible = ref<boolean>()
// 是否可修改
const disabled = ref<boolean>()
// 是否可编辑
const editable = ref<boolean>()
watch(type, newVal => {
  disabled.value = newVal === DETAIL ? false : true
  visible.value = newVal === DETAIL || newVal === EDIT ? true : false
  editable.value = newVal === EDIT || newVal === ADD ? true : false
})
defineExpose({
  changeShowDialog
})
</script>

<style lang="less" scoped>
.el-input,
.el-select,
.item-span,
:deep(.el-date-editor),
:deep(.el-input__wrapper),
.item-div {
  width: 180px;
}
</style>
