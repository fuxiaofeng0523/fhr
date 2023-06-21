<template>
  <el-dialog
    v-model="dialogVisible"
    :title="type && $t(`common.${type}`)">
    <el-form
      v-if="dialogVisible"
      :inline="true"
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
        <span class="item-span">
          {{ spanForm.reason }}
        </span>
      </el-form-item>
      <!-- 详情-->
      <el-form-item
        :label="$t('apply.detail')"
        prop="detail">
        <span class="item-span">
          {{ spanForm.detail }}
        </span>
      </el-form-item>
      <!-- 工作状态-->
      <el-form-item
        :label="$t('apply.workStateName')"
        prop="workStateName">
        <span class="item-span">
          {{ spanForm.workStateName }}
        </span>
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
        :label="$t('changeSalary.afterSalary')">
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
        :label="$t('transfer.afterDepartmentName')">
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
        :label="$t('transfer.afterJobName')">
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
        prop="applyDate">
        <span class="item-span">
          {{ spanForm.applyDate }}
        </span>
      </el-form-item>
      <!-- 处理人 -->
      <el-form-item
        v-if="spanForm.state !== ApplyStateEnum['审核中']"
        :label="$t('apply.adminName')"
        prop="adminName">
        <span class="item-span">
          {{ spanForm.adminName }}
        </span>
      </el-form-item>
      <!-- 处理时间 -->
      <el-form-item
        v-if="spanForm.state !== ApplyStateEnum['审核中']"
        :label="$t('apply.verifyDate')"
        prop="verifyDate">
        <span class="item-span">
          {{ spanForm.verifyDate }}
        </span>
      </el-form-item>
      <!-- 审核状态 -->
      <el-form-item
        :label="$t('apply.state')"
        prop="state">
        <span class="item-span">
          {{ ApplyStateEnum[spanForm.state] }}
        </span>
      </el-form-item>
      <!-- 意见 -->
      <el-form-item
        :label="$t('apply.opinion')"
        prop="opinion">
        <span class="item-span">
          {{ spanForm.opinion }}
        </span>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        v-if="spanForm.state !== ApplyStateEnum['审核中']"
        @click="cancelHandler">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button
        v-if="spanForm.state === ApplyStateEnum['审核中']"
        type="danger"
        @click="confirmHandler(ApplyStateEnum['审核未通过'])">
        {{ $t('common.reject') }}
      </el-button>
      <el-button
        v-if="spanForm.state === ApplyStateEnum['审核中']"
        type="success"
        @click="confirmHandler(ApplyStateEnum['审核通过'])">
        {{ $t('common.pass') }}
      </el-button>
    </template>
    <ContractDialog
      ref="contractDialog"
      @confirm="confirmHandler" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import useStore from '@/store'
import { ElMessageBox, ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { ADD, DETAIL, EDIT } from '@/utils/constant'
import { ApplyStateEnum, ApplyTypeEnum } from '@/enums/apply'
import { getValueByOptionData, initData } from '@/utils/index'
import ContractDialog from './ContractDialog.vue'
const {
  applyStore,
  appStore,
  departmentStore,
  jobStore,
  changeSalaryStore,
  transferStore,
  calendarStore
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
        const s = editApply.value.content.split('调整为')
        spanForm.value.beforeSalary = s[0].slice(1, -1)
        spanForm.value.salary = s[1].slice(1, -1)
      } else if (editApply.value.reason === ApplyTypeEnum['1']) {
        const before = editApply.value.content.split('调整为')[0].split(',')
        const after = editApply.value.content.split('调整为')[1].split(',')
        spanForm.value.beforeDepartment = before[0].slice(1)
        spanForm.value.beforeJob = before[1].slice(0, -1)
        spanForm.value.departmentId = after[0].slice(1)
        spanForm.value.jobId = after[1].slice(0, -1)
      } else if (editApply.value.reason === ApplyTypeEnum['2']) {
        const date = editApply.value.content.split('到')
        const start = date[0].split('(')[1].slice(0, -1)
        const end = date[1].split('(')[1].slice(0, -1)
        spanForm.value.start = start
        spanForm.value.end = end
      }
    }
  }
})
const type = ref<string>()
const changeShowDialog = (key: string) => {
  type.value = key
  dialogVisible.value = !dialogVisible.value
}

// 取消按钮事件
const cancelHandler = () => {
  dialogVisible.value = !dialogVisible.value
}
// 确定按钮事件
const confirmHandler = (state: number, flag: boolean = true) => {
  if (applyForm.value.reason !== ApplyTypeEnum['2'] && flag) {
    passHandler()
  } else
    ElMessageBox.prompt('请输入审核意见', '输入', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(async ({ value }) => {
      if (!value) {
        ElMessage.error('请输入审核意见！')
        return
      }
      if (state === ApplyStateEnum['审核通过']) {
        if (applyForm.value.reason === ApplyTypeEnum['1']) {
          const after = applyForm.value.content.split('调整为')[1].split(',')
          const before = applyForm.value.content.split('调整为')[0].split(',')
          await departmentStore.getDepartmentOption()
          const beforeDepartmentId = getValueByOptionData(
            before[0].slice(1),
            departmentStore.departmentOption!
          )
          const afterDepartmentId = getValueByOptionData(
            after[0].slice(1),
            departmentStore.departmentOption!
          )
          await jobStore.getJobOption(afterDepartmentId!)
          const afterJobId = getValueByOptionData(
            after[1].slice(0, -1),
            jobStore.jobOption!
          )
          await jobStore.getJobOption(beforeDepartmentId!)
          const beforeJobId = getValueByOptionData(
            before[1].slice(0, -1),
            jobStore.jobOption!
          )
          transferStore.createTransfer({
            staffId: applyStore.editApply!.staff.id,
            beforeDepartmentId: beforeDepartmentId!,
            beforeJobId: beforeJobId!,
            afterDepartmentId: afterDepartmentId!,
            afterJobId: afterJobId!,
            reason: '申请调动'
          })
        } else if (applyForm.value.reason === ApplyTypeEnum['0']) {
          changeSalaryStore.createChangeSalary({
            staffId: applyStore.editApply!.staff.id,
            afterSalary: +applyForm.value.content
              .split('调整为')[1]
              .slice(1, -1),
            beforeSalary: +applyForm.value.content
              .split('调整为')[0]
              .slice(1, -1),
            reason: '申请调薪'
          })
        } else if (applyForm.value.reason === ApplyTypeEnum['2']) {
          const date = applyForm.value.content.split('到')
          const start = date[0].split('(')[1].slice(0, -1)
          const end = date[1].split('(')[1].slice(0, -1)
          calendarStore.createCalendar({
            title: '请假',
            startTime: start,
            endTime: end,
            staffId: applyStore.editApply!.staff.id,
            remindTime: '0',
            type: 1
          })
        }
        applyStore.updateApply(applyForm.value.id, {
          state,
          adminId: appStore.userInfo.id,
          opinion: value
        })
      } else if (state === ApplyStateEnum['审核未通过']) {
        applyStore.updateApply(applyForm.value.id, {
          state,
          adminId: appStore.userInfo.id
        })
      }
      dialogVisible.value = !dialogVisible.value
    })
}
// 获取ContractDialog组件
const contractDialog = ref<InstanceType<typeof ContractDialog>>()
// 通过按钮事件
const passHandler = () => {
  contractDialog.value?.changeShowDialog({
    salary: spanForm.value.salary,
    department: spanForm.value.departmentId,
    job: spanForm.value.jobId
  })
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
