<template>
  <el-dialog
    v-model="dialogFormVisible"
    style="height: 90vh; width: 90vw; margin: 5vh auto"
    title="公告">
    <el-table
      height="100%"
      style="width: 100%"
      :data="noticeHome"
      v-infinite-scroll="load">
      <!-- 标题 -->
      <el-table-column
        prop="title"
        :label="$t('notice.title')" />
      <!-- 创建时间 -->
      <el-table-column
        prop="date"
        :label="$t('notice.date')" />
      <!-- 发布人 -->
      <el-table-column
        prop="admin"
        :label="$t('notice.admin')" />
      <!-- 详情 -->
      <el-table-column
        flexd="right"
        width="100px">
        <template #default="scope">
          <el-button
            link
            @click="detailHandler(scope.row)"
            type="primary">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <NoticeDetailDialog ref="noticeDetailDialog" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useStore from '@/store'
import { storeToRefs } from 'pinia'
import NoticeDetailDialog from '@/components/NoticeDetailDialog.vue'
import { NoticeEnum } from '@/enums/notice'
const { noticeStore } = useStore()
const { noticeHome } = storeToRefs(noticeStore)
const pageSize = ref<number>(3)
const flag = ref<boolean>(true)
const load = async () => {
  if (flag.value) {
    pageSize.value += 3
    const length = noticeHome.value!.length
    await noticeStore.getHomeNotice({
      page: 1,
      pageSize: pageSize.value,
      status: NoticeEnum['已发布'] + ''
    })
    if (length <= noticeHome.value!.length) {
      flag.value = false
    }
  }
}
const dialogFormVisible = ref(false)
const changeVisible = () => {
  dialogFormVisible.value = !dialogFormVisible.value
}
defineExpose({
  changeVisible
})
const noticeDetailDialog = ref<InstanceType<typeof NoticeDetailDialog>>()
const changeShowDialog = (notice: Notice) => {
  noticeStore.detailNotice = notice
  noticeDetailDialog.value?.changeVisible()
}

const detailHandler = (notice: Notice) => {
  changeShowDialog(notice)
}
</script>

<style lang="less" scoped></style>
