<template>
  <Container
    name="notice"
    ref="container"
    :table-data="tableData"
    :render-keys="renderKeys"
    :tool-buttons="['delete', 'restore', 'isDelete']"
    :operation-buttons="['delete', 'restore']"
    :pagination="{
      page,
      pageSize,
      total,
      pageChange,
      sizeChange
    }"
    @edit="editHandler"
    @delete="deleteHandler"
    @insert="insertHandler"
    @restore="restoreHandler"
    @change-isDelete="changeIsDeleteHandler">
    <template #search>
      <el-select
        v-model="searchData.status"
        @change="getNotice"
        clearable>
        <el-option
          v-for="item of optionData"
          :label="item.label"
          :value="item.value"></el-option>
      </el-select>
    </template>
    <template #button>
      <el-button
        @click="changeNoticeDialog(ADD)"
        class="button">
        {{ $t('common.add') }}
      </el-button>
    </template>
    <template #operation="{ isDelete, row }">
      <el-button
        v-if="!isDelete"
        @click="changeNoticeDialog(DETAIL, row)"
        size="small"
        link
        type="primary">
        {{ $t('common.detail') }}
      </el-button>
      <el-popconfirm
        v-if="!isDelete && row.status === NoticeEnum['0']"
        title="确定进行发布？"
        @confirm="releaseHandler(row)">
        <template #reference>
          <el-button
            size="small"
            link
            type="success">
            {{ $t('common.release') }}
          </el-button>
        </template>
      </el-popconfirm>
      <el-popconfirm
        v-if="!isDelete && row.status === NoticeEnum['1']"
        title="确定进行撤回？"
        @confirm="withdrawHandler(row)">
        <template #reference>
          <el-button
            size="small"
            link
            type="warning">
            {{ $t('common.withdraw') }}
          </el-button>
        </template>
      </el-popconfirm>
    </template>
    <template #show>
      <NoticeDialog ref="noticeDialog" />
      <NoticeDetailDialog ref="noticeDetailDialog" />
    </template>
  </Container>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import useStore from '@/store'
import Container from '@/components/Container/index.vue'
import NoticeDialog from '@/module-system/components/NoticeDialog.vue'
import NoticeDetailDialog from '@/components/NoticeDetailDialog.vue'
import { NoticeEnum } from '@/enums/notice'
import { formatEnumData } from '@/utils'
import { ADD, DETAIL } from '@/utils/constant'
const { noticeStore, appStore } = useStore()
const { noticeList, page, pageSize, total, searchData } =
  storeToRefs(noticeStore)
// 获取数据
const getNotice = async () => {
  await noticeStore.getNotice()
}

// 初始化数据
const init = async () => {
  await getNotice()
}

// 渲染字段
const renderKeys = computed(() => {
  if (noticeList.value)
    if (noticeList.value?.length > 0) return Object.keys(noticeList.value[0])
  return undefined
})

// 表格数据
const tableData = computed(() => {
  const tableData: any[] = []
  noticeList.value?.forEach(notice => {
    tableData.push({
      ...notice,
      status: NoticeEnum[notice.status as any]
    })
  })
  return tableData
})
// 监听tableData变化
watch(tableData, (newTable, oldTable) => {
  newTable.length === 0 &&
    newTable.length !== oldTable.length &&
    ((page.value = 1), getNotice())
})

// 分页器事件
const pageChange = (page: number) => {
  noticeStore.page = page
  getNotice()
}
const sizeChange = (pageSize: number) => {
  noticeStore.pageSize = pageSize
  getNotice()
}
const optionData = computed(() => formatEnumData(NoticeEnum))

// 获取NoticeDialog组件实例
const noticeDialog = ref<InstanceType<typeof NoticeDialog>>()
// 切换NoticeDialog组件显示
const changeNoticeDialog = (type: string, notice?: Notice) => {
  notice && (noticeStore.editNotice = { ...notice })
  noticeDialog.value && noticeDialog.value.changeShowDialog(type)
}

// 显示删除的事件
const changeIsDeleteHandler = async (isDelete: boolean) => {
  searchData.value.isDelete = isDelete
  await getNotice()
}

// 添加事件
const insertHandler = (notice: CreateNotice) => {
  noticeStore.createNotice({ ...notice, adminId: appStore.userInfo.id })
}

// 编辑按钮
const editHandler = (info: Notice) => {
  noticeStore.editNotice = { ...info }
}

// 发布事件
const releaseHandler = (info: Notice) => {
  noticeStore.updateNotice(
    info.id,
    { status: NoticeEnum['已发布'] + '' },
    '发布成功'
  )
}
// 撤回事件
const withdrawHandler = (info: Notice) => {
  noticeStore.updateNotice(
    info.id,
    { status: NoticeEnum['暂存'] + '' },
    '撤回成功'
  )
}

// 批量删除事件
const deleteHandler = (ids: number[]) => {
  searchData.value.isDelete
    ? noticeStore.thoroughDeleteNotice(ids)
    : noticeStore.deleteNotice(ids)
}

// 恢复事件
const restoreHandler = (ids: number[]) => {
  noticeStore.restoreNotice(ids)
}
// 初始化
init()
</script>

<style lang="less" scoped>
.el-select {
  width: 120px;
}
.button {
  margin-left: 12px;
}
</style>
