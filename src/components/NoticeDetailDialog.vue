<template>
  <el-dialog
    v-model="dialogFormVisible"
    style="height: 90vh; width: 90vw; margin: 5vh auto">
    <div
      v-if="detailNotice"
      class="content">
      <h1>{{ detailNotice.title }}</h1>
      <div>
        <span>发布人:{{ detailNotice.admin }}</span>
        <span>发布时间:{{ detailNotice.date }}</span>
      </div>
      <hr style="height: 2px; width: 100%" />
      <span class="content2">
        &nbsp;&nbsp;&nbsp;&nbsp;{{ detailNotice.content }}
      </span>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useStore from '@/store'
import { storeToRefs } from 'pinia'
const { noticeStore } = useStore()
const { detailNotice } = storeToRefs(noticeStore)
const dialogFormVisible = ref(false)
const changeVisible = () => {
  dialogFormVisible.value = !dialogFormVisible.value
}
defineExpose({
  changeVisible
})
</script>

<style lang="less" scoped>
.content {
  transform: translateY(-25px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 34px;
  }
  div {
    span {
      margin: 0 10px;
    }
  }
  hr {
    margin: 10px 0;
  }
  .content2 {
    align-self: flex-start;
    font-size: 24px;
  }
}
</style>
