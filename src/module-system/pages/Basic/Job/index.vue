<template>
  <Container
    name="job"
    ref="container"
    :table-data="tableData"
    :render-keys="renderKeys"
    :pagination="{
      page,
      pageSize,
      total,
      pageChange,
      sizeChange
    }"
    :dialog="{
      editData: editJob,
      renderDialog,
      editabled: true,
      rules
    }"
    @edit="editHandler"
    @delete="deleteHandler"
    @insert="insertHandler"
    @update="updateHandler"
    @restore="restoreHandler"
    @upload="uploadHandler"
    @change-isDelete="changeIsDeleteHandler">
    <template #search>
      <el-select
        v-model="searchData.departmentId"
        class="left-item"
        @change="getJob"
        clearable>
        <el-option
          v-for="department in departmentOption"
          :key="department.value"
          :label="department.label"
          :value="department.value"></el-option>
      </el-select>
    </template>
  </Container>
</template>

<script setup lang="ts">
import { computed, watch, reactive, ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { FormRules } from 'element-plus'
import useStore from '@/store'
import Container from '@/components/Container/index.vue'
import { getLabelByOptionData, getValueByOptionData } from '@/utils'
const { jobStore, departmentStore, accountStore } = useStore()
const { jobList, editJob, page, pageSize, total, searchData } =
  storeToRefs(jobStore)
const { departmentOption } = storeToRefs(departmentStore)
const { accountOption } = storeToRefs(accountStore)
// 获取数据
const getJob = async () => {
  await jobStore.getJob()
}

// 初始化数据
const init = async () => {
  await getJob()
  await departmentStore.getDepartmentOption()
  await accountStore.getAccountOption()
}

// 渲染字段
const renderKeys = computed(() => {
  if (jobList.value)
    if (jobList.value?.length > 0) return Object.keys(jobList.value[0])
  return undefined
})

// 表格数据
const tableData = computed(() => {
  const tableData: any[] = []
  jobList.value?.forEach(job => {
    tableData.push({
      id: job.id,
      name: job.name,
      departmentId: getLabelByOptionData(
        job.departmentId,
        departmentOption.value!
      ),
      accountId: getLabelByOptionData(job.accountId, accountOption.value!),
      desc: job.desc
    })
  })
  return tableData
})
// 监听tableData变化
watch(tableData, (newTable, oldTable) => {
  newTable.length === 0 &&
    newTable.length !== oldTable.length &&
    ((page.value = 1), getJob())
})

// dialog数据
const renderDialog: ComputedRef<RenderDialogData[]> = computed(() => [
  {
    visible: false,
    disabled: true,
    key: 'id',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'name',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'departmentId',
    component: 'ElSelect',
    optionData: departmentOption.value
  },
  {
    visible: true,
    disabled: false,
    key: 'accountId',
    component: 'ElSelect',
    optionData: accountOption.value
  },
  {
    visible: true,
    disabled: false,
    key: 'desc',
    component: 'ElInput'
  }
])

// 表单验证
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '名称不能为空', trigger: 'blur' },
    { max: 10, message: '名称不能超过10个字符', trigger: 'blur' }
  ],
  departmentId: [
    { required: true, message: '部门不能为空', trigger: 'change' }
  ],
  accountId: [{ required: true, message: '账套不能为空', trigger: 'change' }],
  desc: [{ max: 50, message: '描述不能超过50个字符', trigger: 'blur' }]
})

// 分页器事件
const pageChange = (page: number) => {
  jobStore.page = page
  getJob()
}
const sizeChange = (pageSize: number) => {
  jobStore.pageSize = pageSize
  getJob()
}

// 显示删除的事件
const changeIsDeleteHandler = async (isDelete: boolean) => {
  searchData.value.isDelete = isDelete
  await getJob()
}

// 添加事件
const insertHandler = (job: CreateJob) => {
  jobStore.createJob(job)
}

// 上传事件
const uploadHandler = (file: File) => {
  jobStore.uploadJob(file)
}

// 编辑按钮
const editHandler = (info: Job) => {
  jobStore.editJob = { ...info }
}

// 修改事件
const updateHandler = (job: Partial<Job>) => {
  const { id, departmentId, accountId, ...rest } = job
  jobStore.updateJob(id!, {
    ...rest,
    departmentId: getValueByOptionData(
      departmentId + '',
      departmentOption.value!
    ),
    accountId: getValueByOptionData(accountId + '', accountOption.value!)
  })
}

// 批量删除事件
const deleteHandler = (ids: number[]) => {
  searchData.value.isDelete
    ? jobStore.thoroughDeleteJob(ids)
    : jobStore.deleteJob(ids)
}

// 恢复事件
const restoreHandler = (ids: number[]) => {
  jobStore.restoreJob(ids)
}
// 初始化
init()
</script>

<style lang="less" scoped></style>
