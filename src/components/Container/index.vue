<template>
  <div class="container">
    <el-row :gutter="16">
      <el-col
        :span="24"
        v-if="tool">
        <component :is="card ? 'ElCard' : 'Div'">
          <div class="operation">
            <div>
              <slot name="search"></slot>
            </div>
            <div>
              <el-tooltip
                v-if="toolButtons.includes('isDelete')"
                :content="isDelete ? '已删除数据' : '未删除数据'"
                placement="top">
                <el-switch
                  v-model="isDelete"
                  @change="emit('change-isDelete', isDelete)"
                  size="large"
                  inline-prompt
                  :active-icon="Check"
                  :inactive-icon="Close" />
              </el-tooltip>
              <slot name="button"></slot>
              <el-button
                style="margin-left: 12px"
                v-if="toolButtons.includes('add')"
                @click="changeDialog(ADD)">
                {{ $t('common.add') }}
              </el-button>
              <el-button
                style="margin-left: 12px"
                v-show="!isDelete && toolButtons.includes('delete')"
                @click="batchDeleteHandler">
                {{ $t('common.batchDelete') }}
              </el-button>
              <el-button
                v-show="isDelete && toolButtons.includes('restore')"
                @click="batchRestoreHandler">
                {{ $t('common.batchRestore') }}
              </el-button>
              <el-upload
                v-if="toolButtons.includes('upload')"
                style="margin-left: 12px"
                :before-upload="beforeUploadHandler"
                :on-error="uploadErrorHandler"
                :http-request="uploadRequestHandler"
                :show-file-list="false">
                <el-button type="success">Execl上传</el-button>
              </el-upload>
            </div>
          </div>
        </component>
      </el-col>

      <el-col
        :span="24"
        class="fill">
        <component :is="card ? 'ElCard' : 'Div'">
          <el-table
            v-if="tableData.length"
            height="100%"
            ref="table"
            :data="tableData"
            @selection-change="selectionChangeHandler"
            :row-class-name="tableRowClassName"
            :border="border"
            :stripe="stripe">
            <el-table-column
              v-if="selection"
              type="selection"
              width="55" />
            <!-- 传入数据循环生成table列 -->
            <el-table-column
              v-for="key in renderKeys"
              :key="key"
              show-overflow-tooltip
              :prop="key"
              :fixed="key === 'id'"
              :label="$t(`${name}.${key}`)" />
            <!-- 自定义的table列 -->
            <slot name="table"></slot>
            <slot name="right">
              <el-table-column
                v-if="operation"
                fixed="right"
                :label="$t('common.operation')"
                :width="operationWidth">
                <template #default="scope">
                  <!-- 详情按钮 -->
                  <el-button
                    v-if="!isDelete && operationButtons.includes('detail')"
                    link
                    type="primary"
                    size="small"
                    @click="changeDialog(DETAIL, scope.row)">
                    {{ $t('common.detail') }}
                  </el-button>
                  <slot
                    name="operation"
                    :isDelete="isDelete"
                    :row="scope.row"></slot>
                  <!-- 恢复按钮 -->
                  <el-popconfirm
                    v-if="isDelete && operationButtons.includes('restore')"
                    :title="$t('common.restore_tip')"
                    @confirm="restoreHandler(scope.row.id)">
                    <template #reference>
                      <el-button
                        link
                        type="primary"
                        size="small">
                        {{ $t('common.restore') }}
                      </el-button>
                    </template>
                  </el-popconfirm>
                  <!-- 删除按钮 -->
                  <el-popconfirm
                    v-if="operationButtons.includes('delete')"
                    :title="
                      $t(isDelete ? 'common.delete_tip2' : 'common.delete_tip')
                    "
                    @confirm="deleteHandler(scope.row.id)">
                    <template #reference>
                      <el-button
                        link
                        type="danger"
                        size="small">
                        {{ $t('common.delete') }}
                      </el-button>
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </slot>
          </el-table>
          <el-empty
            v-else
            style="width: 100%; height: 100%"
            :image-size="200"
            description="No Data" />
          <!-- table-layout="fixed" -->
        </component>
      </el-col>
      <el-col
        :span="24"
        v-if="pagination && pagination.total">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[1, 5, 10, 15, 20]"
          small
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="pagination!.sizeChange"
          @current-change="pagination!.pageChange" />
      </el-col>
    </el-row>
    <slot name="show">
      <Dialog
        v-if="props.dialog"
        ref="dialog"
        :name="name"
        :edit-data="props.dialog.editData"
        :rules="props.dialog.rules"
        :render-dialog="props.dialog.renderDialog"
        :editabled="props.dialog.editabled"
        :class-name="props.dialog.className"
        :drawer="props.dialog.drawer"
        @insert="data => emit('insert', data)"
        @update="data => emit('update', data)">
        <template #dialog>
          <slot name="dialog"></slot>
        </template>
        <template
          #other="{ formLabelWidth, visible, editable, dataForm, spanForm }">
          <slot
            name="other"
            :formLabelWidth="formLabelWidth"
            :visible="visible"
            :editable="editable"
            :dataForm="dataForm"
            :spanForm="spanForm"></slot>
        </template>
      </Dialog>
    </slot>
  </div>
  <!-- <div
    v-else
    class="loading">
    <el-skeleton
      style="width: 100%; height: 100%"
      animated
      :throttle="500">
      <template #template>
        <el-skeleton-item
          v-if="tool"
          variant="p"
          style="width: 100%; height: 72px" />
        <el-skeleton-item
          class="fill"
          variant="p" />
      </template>
    </el-skeleton>
  </div> -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  FormRules,
  ElTable,
  UploadRawFile,
  ElMessage,
  UploadRequestOptions,
  ColumnCls,
  ElMessageBox
} from 'element-plus'
import { Check, Close } from '@element-plus/icons-vue'
import Dialog from '@/components/Dialog/index.vue'
import { ADD, DETAIL } from '@/utils/constant'
interface ContainerProps {
  name: string // 名字,在$t使用
  tool?: boolean // 是否显示工具栏
  tableData: any[] // 表格数据
  border?: boolean // 是否显示边框
  renderKeys?: string[] // 渲染到页面的数据
  tableRowClassName?: ColumnCls<any> // 表格行的class
  stripe?: boolean // 是否显示斑马纹
  toolButtons?: any // 工具栏按钮
  operationButtons?: any // 工具栏按钮
  card?: boolean // 是否显示card
  operation?: boolean // 是否显示操作
  selection?: boolean // 是否显示选择框
  operationWidth?: string // 操作列宽度
  pagination?: {
    page: number
    pageSize: number
    total: number
    sizeChange?: Function
    pageChange?: Function
  }
  dialog?: {
    // name: string // 名字,在$t使用
    editData: any // 编辑的数据
    rules?: FormRules // 校验规则
    formLabelWidth?: string // 表单label宽度
    renderDialog: RenderDialogData[] // 渲染到页面的数据
    editabled?: boolean // 是否可编辑，用来控制确定按钮
    className?: string // dialog的class
    drawer?: boolean
  }
}
interface ContainerEmits {
  (e: 'insert', data: any): void // 添加事件
  (e: 'update', data: any): void // 修改事件
  (e: 'delete', ids: number[]): void
  (e: 'edit', info: any): void
  (e: 'restore', ids: number[]): void
  (e: 'upload', file: File): void
  (e: 'change-isDelete', isDelete: boolean): void // 显示删除
}
const props = withDefaults(defineProps<ContainerProps>(), {
  tool: true,
  border: true,
  stripe: false,
  toolButtons: ['add', 'delete', 'restore', 'upload', 'isDelete'],
  operationButtons: ['detail', 'delete', 'restore'],
  card: true,
  operation: true,
  selection: true
})
const emit = defineEmits<ContainerEmits>()

// 获取dialog组件
const dialog = ref<InstanceType<typeof Dialog>>()
// 控制dialog显示与隐藏
const changeDialog = (type: string, info?: any) => {
  info && emit('edit', info)
  dialog.value?.changeShowVisible(type)
}
// 删除按钮
const deleteHandler = (id: number) => {
  emit('delete', [id])
}

// 恢复按钮
const restoreHandler = (id: number) => {
  emit('restore', [id])
}

// elTable实例
const table = ref<InstanceType<typeof ElTable>>()
// 选择数据
const multipleSelection = ref<any[]>()
// 选择事件
const selectionChangeHandler = (val: any[]) => {
  multipleSelection.value = val
}

// isDelete,switch开关
const isDelete = ref<boolean>(false)

// 批量删除
const batchDeleteHandler = () => {
  ElMessageBox.confirm('确定删除？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const ids: number[] = []
      multipleSelection.value?.forEach(item => ids.push(item.id))
      emit('delete', ids)
    })
    .catch(() => {})
}
// 批量恢复
const batchRestoreHandler = () => {
  const ids: number[] = []
  multipleSelection.value?.forEach(item => ids.push(item.id))
  emit('restore', ids)
}

// 文件上传前
const beforeUploadHandler = (rawFile: UploadRawFile) => {
  const types = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
  const isExcel = types.includes(rawFile.type)
  if (!isExcel) {
    ElMessage.error('只能上传 Excel 文件')
    return false
  }
}
// 文件上传事件
const uploadRequestHandler = (options: UploadRequestOptions) => {
  emit('upload', options.file)
}
// 文件上传失败
const uploadErrorHandler = (err: any, file: UploadRawFile) => {
  ElMessage.error('上传失败')
}
defineExpose({
  isDelete,
  dialog
})
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  .operation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
      display: flex;
      align-items: center;
    }
  }
  .el-row {
    display: flex;
    height: 100%;
    flex-wrap: nowrap;
    flex-direction: column;
    .el-col-24 {
      flex: 0 1 auto;
    }
    .el-col:not(:first-child) {
      padding-top: 16px;
    }
    .fill {
      flex: 1;
      > div {
        height: 100%;
      }
      .el-card {
        height: 100%;
        // ? 失效？
        // :deep(.el-card__body) {
        //   height: 100% !important;
        // }
      }
    }
    .el-pagination {
      float: right;
    }
  }
  .left-item {
    width: 120px !important;
    margin-right: 16px;
  }
}
.loading {
  width: 100%;
  height: 100%;
  .el-skeleton {
    display: flex;
    height: 100%;
    flex-wrap: nowrap;
    flex-direction: column;
    .el-skeleton__item:not(:first-child) {
      margin-top: 16px;
    }
    .fill {
      flex: 1;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter {
  opacity: 0;
  transform: translateX(100%);
}
.slide-left-enter-active {
  opacity: 1;
  transform: translateX(0%);
  transition: all 0.3s ease-in-out;
}
.slide-left-leave-active {
  opacity: 0;
  transform: translateX(-100%);
  transition: all 0.3s ease-in-out;
}

.slide-right-enter {
  opacity: 0;
  transform: translateX(-100%);
}
.slide-right-enter-active {
  opacity: 1;
  transform: translateX(0%);
  transition: all 0.3s ease-in-out;
}
.slide-right-leave-active {
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease-in-out;
}
</style>
