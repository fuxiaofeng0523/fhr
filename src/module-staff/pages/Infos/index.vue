<template>
  <div class="outer">
    <Container
      name="staff"
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
        editData: editStaff,
        renderDialog,
        editabled: true,
        rules,
        drawer: true
      }"
      @edit="editHandler"
      @delete="deleteHandler"
      @insert="insertHandler"
      @update="updateHandler"
      @restore="restoreHandler"
      @upload="uploadHandler"
      @change-isDelete="changeIsDeleteHandler">
      <template #search>
        <!-- 部门 -->
        <el-select
          @change="getStaff"
          class="search"
          placeholder="部门"
          clearable
          v-model="searchData.departmentId">
          <el-option
            v-for="item of departmentStore.departmentOption"
            :key="item.value"
            :value="item.value"
            :label="item.label"></el-option>
        </el-select>
        <!-- 职位 -->
        <el-select
          @change="getStaff"
          :disabled="!searchData.departmentId"
          class="search"
          placeholder="职位"
          clearable
          v-model="searchData.jobId">
          <el-option
            v-for="item of jobStore.jobOption"
            :key="item.value"
            :value="item.value"
            :label="item.label"></el-option>
        </el-select>
        <!-- 工作状态 -->
        <el-select
          @change="getStaff"
          class="search"
          placeholder="工作状态"
          clearable
          v-model="searchData.workStateId">
          <el-option
            v-for="item of workStateStore.workStateOption"
            :key="item.value"
            :value="item.value"
            :label="item.label"></el-option>
        </el-select>
        <!-- 性别 -->
        <el-select
          @change="getStaff"
          class="search"
          placeholder="性别"
          clearable
          v-model="searchData.sex">
          <el-option
            v-for="item of sexOption"
            :key="item.value"
            :value="item.value"
            :label="item.label"></el-option>
        </el-select>
        <!-- 姓名 -->
        <el-input
          @change="getStaff"
          class="search"
          placeholder="姓名"
          clearable
          v-model="searchData.name"></el-input>
      </template>
      <template #other="{ formLabelWidth, visible, editable, dataForm }">
        <el-form-item
          :label="$t('staff.avatar')"
          :label-width="formLabelWidth">
          <el-image
            v-if="!editable"
            :src="avatarUrl"
            fit="cover" />
          <el-upload
            v-else
            class="avatar-uploader"
            method="post"
            name="file"
            action="/dev-api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <el-image
              v-if="imageUrl || avatarUrl"
              :src="imageUrl ? imageUrl : avatarUrl"
              class="avatar"
              fit="cover" />
            <el-icon
              v-else
              class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </template>
      <template #right>
        <!--
        详情/恢复 角色 奖惩
        调薪 调动 删除
       -->
        <el-table-column
          fixed="right"
          :label="$t('common.operation')"
          width="180">
          <template #default="scope">
            <el-row>
              <el-col :span="6">
                <!-- 详情按钮 -->
                <el-button
                  v-if="!isDelete"
                  link
                  type="primary"
                  size="small"
                  @click="changeDialog(DETAIL, scope.row)">
                  {{ $t('common.detail') }}
                </el-button>

                <!-- 恢复按钮 -->
                <el-popconfirm
                  v-if="isDelete"
                  :title="$t('common.restore_tip')"
                  @confirm="restoreHandler([scope.row.id])">
                  <template #reference>
                    <el-button
                      link
                      type="primary"
                      size="small">
                      {{ $t('common.restore') }}
                    </el-button>
                  </template>
                </el-popconfirm>
              </el-col>
              <el-col
                :span="6"
                v-if="!isDelete">
                <el-button
                  link
                  size="small"
                  type="primary"
                  @click="chagneShowRoleDialog(scope.row)">
                  角色
                </el-button>
              </el-col>
              <el-col
                :span="6"
                v-if="!isDelete">
                <el-button
                  link
                  size="small"
                  type="primary"
                  @click="chagneShowAwardDialog(scope.row)">
                  奖惩
                </el-button>
              </el-col>
              <el-col
                :span="6"
                v-if="!isDelete">
                <el-button
                  link
                  size="small"
                  type="primary"
                  @click="chagneShowChangeSalaryDialog(scope.row)">
                  调薪
                </el-button>
              </el-col>
              <el-col
                :span="6"
                v-if="!isDelete">
                <el-button
                  link
                  size="small"
                  type="primary"
                  @click="chagneShowTransferDialog(scope.row)">
                  调动
                </el-button>
              </el-col>
              <el-col
                :span="6"
                v-if="!isDelete">
                <el-button
                  :disabled="scope.row.formDate"
                  @click="becomeRegularHandler(scope.row)"
                  link
                  size="small"
                  type="primary">
                  转正
                </el-button>
              </el-col>
              <el-col
                :span="6"
                v-if="!isDelete">
                <el-button
                  :disabled="scope.row.leaveDate"
                  link
                  @click="departHandler(scope.row)"
                  size="small"
                  type="primary">
                  离职
                </el-button>
              </el-col>
              <el-col :span="6">
                <!-- 删除按钮 -->
                <el-popconfirm
                  :title="
                    $t(isDelete ? 'common.delete_tip2' : 'common.delete_tip')
                  "
                  @confirm="deleteHandler([scope.row.id])">
                  <template #reference>
                    <el-button
                      link
                      type="danger"
                      size="small">
                      {{ $t('common.delete') }}
                    </el-button>
                  </template>
                </el-popconfirm>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </template>
    </Container>
    <RoleDialog ref="roleDialog" />
    <AwardDialog ref="awardDialog" />
    <ChangeSalaryDialog ref="changeSalaryDialog" />
    <TransferDialog ref="transferDialog" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, reactive, ComputedRef, ref, h } from 'vue'
import { storeToRefs } from 'pinia'
import {
  ElDatePicker,
  FormRules,
  UploadProps,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import useStore from '@/store'
import Container from '@/components/Container/index.vue'
import RoleDialog from '@/module-staff/components/RoleDialog.vue'
import AwardDialog from '@/module-staff/components/AwardDialog.vue'
import ChangeSalaryDialog from '@/module-staff/components/ChangeSalaryDialog.vue'
import { getValueByOptionData, initArray, formatEnumData } from '@/utils'
import {
  WedlockEnum,
  NationEnum,
  PoliticalAffiliationEnum,
  EngageFormEnum,
  EducationLevelEnum,
  SexEnum
} from '@/enums/staff'
import { formatStaff } from '@/module-staff/utils'
import { validatePhone } from '@/utils/validate'
import { ADD, DETAIL } from '@/utils/constant'
import TransferDialog from '@/module-staff/components/TransferDialog.vue'
const {
  staffInfosStore,
  appStore,
  departmentStore,
  jobStore,
  workStateStore,
  roleStore
} = useStore()
const { staffList, editStaff, page, pageSize, total, searchData } =
  storeToRefs(staffInfosStore)
// 获取数据
const getStaff = async () => {
  await staffInfosStore.getStaff()
  await departmentStore.getDepartmentOption()
  await workStateStore.getWorkStateOption()
  await roleStore.getRoleOption()
}
// 性别Option
const sexOption = computed(() => formatEnumData(SexEnum))

// 监听departmentId获取jobOption
watch(
  () => searchData.value.departmentId,
  async newVal => {
    if (newVal) {
      await jobStore.getJobOption(+newVal)
    } else {
      searchData.value.jobId = undefined
    }
  }
)

// 初始化数据
const init = async () => {
  await getStaff()
}

// 渲染字段
const renderKeys = computed(() => {
  if (staffList.value)
    if (staffList.value?.length > 0) {
      return [
        'id',
        'workNumber',
        'name',
        'sex',
        'phone',
        'email',
        'department',
        'job',
        'workState',
        'roleName'
      ]
    }
  return undefined
})

// 表格数据
const tableData = computed(() => {
  const tableData: any[] = []
  staffList.value?.forEach(staff => {
    tableData.push({
      ...staff,
      roleName: staff.role.name
    })
  })
  return tableData
})
// 监听tableData变化
watch(tableData, (newTable, oldTable) => {
  newTable.length === 0 &&
    newTable.length !== oldTable.length &&
    ((page.value = 1), getStaff())
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
    visible: false,
    disabled: true,
    key: 'workNumber',
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
    key: 'sex',
    component: 'ElSelect',
    optionData: appStore.getSexOption()
  },
  {
    visible: true,
    disabled: false,
    key: 'phone',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'email',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'department',
    component: 'ElSelect',
    optionData: departmentStore.departmentOption
  },
  {
    visible: true,
    disabled: false,
    key: 'job',
    component: 'ElSelect',
    optionData: jobStore.jobOption
  },
  {
    visible: false,
    disabled: true,
    key: 'birthday',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'idCard',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'wedlock',
    component: 'ElSelect',
    optionData: appStore.getWedlockOption()
  },
  {
    visible: true,
    disabled: false,
    key: 'nation',
    component: 'ElSelect',
    optionData: appStore.getNationOption()
  },
  {
    visible: true,
    disabled: false,
    key: 'nativePlace',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'politicalAffiliation',
    component: 'ElSelect',
    optionData: appStore.getPoliticalAffiliationOption()
  },
  {
    visible: true,
    disabled: false,
    key: 'address',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: true,
    key: 'basisSalary',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'engageForm',
    component: 'ElSelect',
    optionData: appStore.getEngageFormOption()
  },
  {
    visible: true,
    disabled: false,
    key: 'educationLevel',
    component: 'ElSelect',
    optionData: appStore.getEducationLevelOption()
  },
  {
    visible: true,
    disabled: false,
    key: 'specialty',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'school',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'contractDate',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'workAge',
    component: 'ElInput'
  },
  {
    visible: true,
    disabled: false,
    key: 'inDate',
    component: 'ElDatePicker',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD'
  },
  {
    visible: true,
    disabled: false,
    key: 'formDate',
    component: 'ElDatePicker',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD'
  },
  {
    visible: true,
    disabled: false,
    key: 'leaveDate',
    component: 'ElDatePicker',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD'
  },
  {
    visible: true,
    disabled: false,
    key: 'beginDate',
    component: 'ElDatePicker',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD'
  },
  {
    visible: true,
    disabled: false,
    key: 'endDate',
    component: 'ElDatePicker',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD'
  }
])
// 表单验证
const rules = reactive<FormRules>({
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' }
  ],
  name: [
    { required: true, message: '姓名不能为空', trigger: 'blur' },
    { min: 2, max: 5, message: '姓名长度为2-5个字符', trigger: 'blur' }
  ],
  // idCard: [{ required: true, message: '身份证号不能为空', trigger: 'blur' }],
  department: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
  job: [{ required: true, message: '职位不能为空', trigger: 'blur' }],
  workState: [{ required: true, message: '工作状态不能为空', trigger: 'blur' }],
  engageForm: [
    { required: true, message: '聘用形式不能为空', trigger: 'change' }
  ],
  inDate: [{ required: true, message: '入职日期不能为空', trigger: 'change' }],
  contractDate: [
    { required: true, message: '合同期限不能为空', trigger: 'change' }
  ],
  beginDate: [
    { required: true, message: '合同起始日期不能为空', trigger: 'change' }
  ]
})

// 获取Container组件实例
const container = ref<InstanceType<typeof Container>>()
// changeDialog
const changeDialog = (type: string, info?: Staff) => {
  info && editHandler(info)
  container.value!.dialog?.changeShowVisible(type)
}
// isDelete
const isDelete = computed(() => container.value?.isDelete)

// 监听部门获取职位
watch(
  [
    () => container.value?.dialog?.dataForm.department,
    () => container.value?.dialog?.dataForm.job
  ],
  async (newVal, oldVal) => {
    if (typeof newVal[0] !== 'string' || newVal[0] === '')
      if (newVal[0]) {
        if (newVal[0] !== oldVal[0]) {
          initArray(jobStore.jobOption!)
          await jobStore.getJobOption(newVal[0])
          container.value!.dialog!.dataForm.job = newVal[1]
          if (typeof oldVal[1] !== 'string' || oldVal[1] === '') {
            container.value!.dialog!.dataForm.job = undefined
            container.value!.dialog!.dataForm.basisSalary = undefined
          }
        }
        newVal[1] &&
          (container.value!.dialog!.dataForm.basisSalary =
            await jobStore.getJobSalary(newVal[1]))
      } else {
        initArray(jobStore.jobOption!)
        container.value!.dialog!.dataForm.job = undefined
        container.value!.dialog!.dataForm.basisSalary = undefined
      }
  }
)

// 分页器事件
const pageChange = (page: number) => {
  staffInfosStore.page = page
  getStaff()
}
const sizeChange = (pageSize: number) => {
  staffInfosStore.pageSize = pageSize
  getStaff()
}

// 显示删除的事件
const changeIsDeleteHandler = async (isDelete: boolean) => {
  searchData.value.isDelete = isDelete
  await getStaff()
}

// 添加事件
const insertHandler = (staff: CreateStaff) => {
  const newStaff = formatStaff(staff)
  staffInfosStore.createStaff(newStaff as any)
}

// 上传事件
const uploadHandler = (file: File) => {
  staffInfosStore.uploadStaff(file)
}

// 编辑按钮
const editHandler = async (info: Staff) => {
  staffInfosStore.editStaff = { ...info }
  await jobStore.getJobOption(
    getValueByOptionData(info.department, departmentStore.departmentOption!)!
  )
  const {
    department,
    job,
    wedlock,
    nation,
    politicalAffiliation,
    engageForm,
    educationLevel,
    sex,
    ...rest
  } = container.value!.dialog!.dataForm
  container.value!.dialog!.dataForm = {
    ...rest,
    department: getValueByOptionData(
      department,
      departmentStore.departmentOption!
    ),
    job: getValueByOptionData(job, jobStore.jobOption!),
    wedlock: '' + WedlockEnum[wedlock],
    sex: '' + SexEnum[sex],
    nation: '' + NationEnum[nation],
    politicalAffiliation: '' + PoliticalAffiliationEnum[politicalAffiliation],
    engageForm: '' + EngageFormEnum[engageForm],
    educationLevel: '' + EducationLevelEnum[educationLevel]
  }
}

// 修改事件
const updateHandler = (staff: Partial<Staff>) => {
  const newStaff = formatStaff(staff as any)
  const { id, ...rest } = newStaff as any
  staffInfosStore.updateStaff(id!, rest)
}

// 转正事件
const becomeRegularHandler = (staff: Partial<Staff>) => {
  const date = ref<string | undefined>(undefined)
  ElMessageBox({
    title: '转正信息',
    message: () =>
      h(ElDatePicker as any, {
        modelValue: date.value,
        'onUpdate:modelValue': (val: string | undefined) => {
          date.value = val
        },
        type: 'date',
        format: 'YYYY-MM-DD',
        placeholder: '转正日期',
        'value-format': 'YYYY-MM-DD'
      }),
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        if (!date.value) return ElMessage.error('请选择日期')
        else
          staffInfosStore.updateStaff(
            staff.id!,
            { formDate: date.value },
            '转正成功'
          )
      }
      done() // 关闭对话框
    }
  })
}

// 离职事件
const departHandler = (staff: Partial<Staff>) => {
  const date = ref<string | undefined>(undefined)
  ElMessageBox({
    title: '离职信息',
    message: () =>
      h(ElDatePicker as any, {
        modelValue: date.value,
        'onUpdate:modelValue': (val: string | undefined) => {
          date.value = val
        },
        type: 'date',
        format: 'YYYY-MM-DD',
        placeholder: '离职日期',
        'value-format': 'YYYY-MM-DD'
      }),
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        if (!date.value) return ElMessage.error('请选择日期')
        else
          staffInfosStore.updateStaff(
            staff.id!,
            { leaveDate: date.value, workStateId: 4 },
            '离职成功'
          )
      }
      done() // 关闭对话框
    }
  })
}

// 批量删除事件
const deleteHandler = (ids: number[]) => {
  searchData.value.isDelete
    ? staffInfosStore.thoroughDeleteStaff(ids)
    : staffInfosStore.deleteStaff(ids)
}

// 恢复事件
const restoreHandler = (ids: number[]) => {
  staffInfosStore.restoreStaff(ids)
}

// 头像
const avatarUrl = computed<string | undefined>(() =>
  container.value?.dialog?.dataForm.avatar
    ? `${import.meta.env.VITE_IMG_URL}/${
        container.value?.dialog?.dataForm.avatar
      }`
    : undefined
)

const imageUrl = ref()
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  // 保存图片名称
  container.value!.dialog!.dataForm!.avatar = response
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('图片必须是JPG或PNG格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片不能超过2MB!')
    return false
  }
  return true
}

// 获取 RoleDialogVue 组件实例
const roleDialog = ref<InstanceType<typeof RoleDialog>>()

const chagneShowRoleDialog = (staff: Staff) => {
  staffInfosStore.editStaff = { ...staff }
  roleDialog.value!.changeShowDialog(staff.id, staff.role.id)
}
// 获取 AwardDialogVue 组件实例
const awardDialog = ref<InstanceType<typeof AwardDialog>>()

const chagneShowAwardDialog = (staff: Staff) => {
  awardDialog.value!.changeShowDialog(staff.id, staff.name)
}

// 获取 ChangeSalaryDialog 组件实例
const changeSalaryDialog = ref<InstanceType<typeof ChangeSalaryDialog>>()

const chagneShowChangeSalaryDialog = (staff: Staff) => {
  changeSalaryDialog.value!.changeShowDialog(
    staff.id,
    staff.name,
    staff.basisSalary
  )
}
// 获取 TransferDialogDialog 组件实例
const transferDialog = ref<InstanceType<typeof TransferDialog>>()

const chagneShowTransferDialog = (staff: Staff) => {
  transferDialog.value!.changeShowDialog(staff)
}
// 初始化
init()
</script>

<style lang="less" scoped>
.outer {
  width: 100%;
  height: 100%;
}
.el-row {
  flex-direction: row;
  flex-wrap: wrap;
  .el-col {
    padding: 5px !important;
  }
}
.el-input,
.el-select,
.item-span,
.el-textarea,
:deep(.el-date-editor),
:deep(.el-input__wrapper) {
  width: 180px !important;
}
.search {
  width: 120px !important;
  margin-right: 10px;
}
.avatar-uploader .avatar,
.el-image {
  width: 180px;
  height: 180px;
  display: block;
}
.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 180px;
  height: 180px;
  text-align: center;
}
</style>
