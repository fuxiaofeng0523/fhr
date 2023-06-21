<template>
  <el-scrollbar>
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card class="top-card">
          <div class="user-card">
            <div class="user-card-left">
              <el-avatar
                :size="150"
                fit="cover"
                :src="avatarUrl" />
              <div class="user-card-info">
                <span class="name">{{ staffInfo?.name }}</span>
                <span class="role">
                  {{ roleName}}
                </span>
                <span class="hello">{{ hello() }}</span>
              </div>
            </div>
            <div class="user-card-right">
              <ul>
                <li>
                  工号：
                  <span>{{ staffInfo?.workNumber }}</span>
                </li>
                <li>
                  部门：
                  <span>
                    {{ staffInfo?.department }}
                  </span>
                </li>
                <li>
                  职位：
                  <span>
                    {{ staffInfo?.job }}
                  </span>
                </li>
                <li>
                  邮箱：
                  <span>{{ staffInfo?.email }}</span>
                </li>
                <li>
                  电话：
                  <span>{{ staffInfo?.phone }}</span>
                </li>
              </ul>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="top-card">
          <span class="title">公告</span>
          <span
            class="more"
            @click="changeShowNoticeDialog">
            更多...
          </span>
          <el-scrollbar>
            <el-collapse
              v-model="activeName"
              accordion>
              <el-collapse-item
                v-for="notice of noticeHome"
                :key="notice.id"
                :title="notice.title"
                :name="notice.id">
                <div>
                  <span>发布人：{{ notice.admin }}</span>
                  <span>发布时间：{{ notice.date }}</span>
                </div>
                <div>
                  {{ notice.content }}
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col
        :span="24"
        class="bottom">
        <el-card>
          <el-row :gutter="16">
            <el-col :span="16">
              <el-calendar
                v-model="value"
                ref="calendar">
                <template #header="{ date }">
                  <span>{{ date }}</span>
                  <el-button-group>
                    <el-button
                      size="small"
                      @click="changeShowCalendarDialog(ADD)">
                      +日程
                    </el-button>
                    <el-button
                      size="small"
                      @click="selectDate('prev-year')">
                      上一年
                    </el-button>
                    <el-button
                      size="small"
                      @click="selectDate('prev-month')">
                      上个月
                    </el-button>
                    <el-button
                      size="small"
                      @click="selectDate('today')">
                      今天
                    </el-button>
                    <el-button
                      size="small"
                      @click="selectDate('next-month')">
                      下个月
                    </el-button>
                    <el-button
                      size="small"
                      @click="selectDate('next-year')">
                      下一年
                    </el-button>
                  </el-button-group>
                </template>
                <template #date-cell="{ data }">
                  <p
                    :class="data.isSelected ? 'is-selected' : ''"
                    class="item">
                    {{ data.day.split('-').at(-1) }}
                    <div class="markBox" @click="calendarHandler">
                      <span
                      v-if="isWeek(data.day)"
                      class="rest">
                      休
                    </span>
                    <template v-for="item in calendarList">
                      <span
                        :key="item.id"
                        :data-id="item.id"
                        v-if="item.startTime.slice(0, 10) === data.day"
                        class="rest mark">
                        {{ item.title.charAt(0) }}
                      </span>
                    </template>
                    </div>
                  </p>
                </template>
              </el-calendar>
            </el-col>
            <el-col :span="8">
              <div class="start">
                <RouterLink
                  v-for="item of fastValue"
                  :key="item.key"
                  :to="item.initial">
                  <div>
                    <div class="img-out">
                      <EIcon
                        class="img"
                        icon="Document"></EIcon>
                    </div>
                    <span>{{ item.label }}</span>
                  </div>
                </RouterLink>
                <a @click="changeShowFastDialog">
                  <div>
                    <div class="img-out">
                      <EIcon
                        class="img"
                        icon="Plus"></EIcon>
                    </div>
                  </div>
                </a>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <NoticeDialog ref="noticeDialog" />
    <FastDialog ref="fastDialog" />
    <CalendarDialog ref="calendarDialog" />
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, computed, onMounted,watch } from 'vue'
import useStore from '@/store'
import { storeToRefs } from 'pinia'
import NoticeDialog from '@/components/NoticeDialog.vue'
import FastDialog from '@/components/FastDialog.vue'
import CalendarDialog from '@/components/CalendarDialog.vue'
import { hello } from '@/utils'
import { FASTDATA, FASTACTIVE, EDIT, ADD } from '@/utils/constant'
const { staffInfoStore, calendarStore, noticeStore, appStore } = useStore()
const { staffInfo } = storeToRefs(staffInfoStore)
const { noticeHome } = storeToRefs(noticeStore)
const { calendarList } = storeToRefs(calendarStore)
const init = async () => {
  await staffInfoStore.getStaffById(appStore.userInfo.id)
  await noticeStore.getHomeNotice()
}
// 身份
const roleName = computed(()=>
   appStore.isAdminNow ? staffInfo.value?.role : '员工'
)
const activeName = ref<number>()
const avatarUrl = computed<string>(
  () => `${import.meta.env.VITE_IMG_URL}/${staffInfo.value?.avatar}`
)
const fastData = ref(JSON.parse(localStorage.getItem(FASTDATA) || '[]'))
const fastActice = ref(JSON.parse(localStorage.getItem(FASTACTIVE) || '[]'))
const fastValue = computed(() => {
  return fastActice.value.map((item: number) => {
    return fastData.value[item]
  })
})
const calendar = ref()
const selectDate = (val: string) => {
  calendar.value.selectDate(val)
}
const value = ref(new Date())
// 判断是否周六日
const isWeek = (date: any) => {
  const day = new Date(date).getDay()
  return day === 6 || day === 0
}

onMounted(async () => {
  await calendarStore.getCalendar()
})
// 查看日历
const calendarHandler = (e:MouseEvent)=>{
  if(((e.target as HTMLElement).nodeName.toLocaleLowerCase()==='span')){
    const id = (e.target as HTMLElement).dataset.id
    if(id) {
    const calendar = calendarStore.calendarList.find(item=>item.id===+id)
    calendarStore.editCalendar={...calendar!}
    changeShowCalendarDialog(EDIT)
    }
  }
}
// 获取noticeDialog
const noticeDialog = ref<InstanceType<typeof NoticeDialog>>()
// 切换qrCodeDialog组件显示与隐藏
const changeShowNoticeDialog = () => {
  noticeDialog.value?.changeVisible()
}
// 获取fastDialog
const fastDialog = ref<InstanceType<typeof FastDialog>>()
// 切换fastDialog组件显示与隐藏
const changeShowFastDialog = () => {
  fastDialog.value?.changeVisible()
}

watch(
  () =>fastDialog.value && fastDialog.value.dialogFormVisible,
  (newVal) => {
    if(!newVal) {
      setTimeout(()=>{  fastData.value = JSON.parse(localStorage.getItem(FASTDATA) || '[]')
      fastActice.value = JSON.parse(localStorage.getItem(FASTACTIVE) || '[]')},200)
    }
  }
)
// 获取calendarDialog
const calendarDialog = ref<InstanceType<typeof CalendarDialog>>()
// 切换calendarDialog组件显示与隐藏
const changeShowCalendarDialog = (type:string) => {
  calendarDialog.value?.changeVisible(type,value.value)
}
init()
</script>

<style lang="less" scoped>
.el-scrollbar {
  :deep(.el-scrollbar__bar) {
    z-index: 999;
  }
  :deep(.el-scrollbar__bar.is-horizontal) {
    height: 0 !important;
  }
}

.top-card {
  position: relative;
  height: 200px;
  .title {
    font-size: 20px;
    color: #409eff !important;
    &:hover {
      opacity: 0.7;
    }
  }
  :deep(.el-card__body) {
    height: 100%;
  }
  .more {
    position: absolute;
    cursor: pointer;
    right: 20px;
    top: 24px;
    font-size: 14px;
    color: #409eff !important;
    &:hover {
      opacity: 0.7;
    }
  }
}
.el-collapse-item {
  :deep(.el-collapse-item__content) {
    max-height: 70px;
    overflow: hidden;
  }
  span {
    margin-right: 20px;
  }
}
.user-card {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-right: 60px;
  .user-card-left {
    display: flex;
    .el-avatar {
      border: 1px solid #e0e0e0;
    }
    .user-card-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 20px;
      span {
        padding: 5px 0;
      }
      .name {
        font-size: 24px;
        font-weight: 400;
        color: #616161;
      }
      .role {
        color: #ff6900;
      }
      .hello {
        margin: 0 0 10px;
        color: #b0b0b0;
      }
    }
  }
  .user-card-right {
    display: flex;
    flex-direction: column;
    ul {
      color: #757575;
      li {
        padding: 5px 0;
        span {
          font-size: 14px;
        }
      }
    }
  }
}
.bottom {
  padding-top: 16px;
}

.item {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  .markBox{
    display: flex;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    flex-direction: column;
    flex-wrap: wrap;
    .rest {
      opacity: 0.8;
      color: #fff;
      text-align: center;
      margin: 0 5px 5px 0;
      border-radius: 50%;
      background: #ff6709;
      width: 18px;
      height: 18px;
      line-height: 18px;
      display: inline-block;
      font-size: 12px;
      cursor: pointer;
    }
    .mark{
      background: #409eff;
    }
  }
}
.start {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
  a {
    color: var(--el-text-color-primary);
    &:visited {
      color: var(--el-text-color-primary);
    }
    &:nth-child(3n-2) .img-out {
      background-color: #409eff;
    }
    &:nth-child(3n-2) :hover span {
      color: #409eff;
    }
    &:nth-child(3n-1) .img-out {
      background-color: #ff6709;
    }
    &:nth-child(3n-1) :hover span {
      color: #ff6709;
    }
    &:nth-child(3n) .img-out {
      background-color: #8bc34a;
    }
    &:nth-child(3n) :hover span {
      color: #8bc34a;
    }
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      .img-out {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 1px solid #e0e0e0;
        opacity: 0.7;
        color: #fff;
        .img {
          width: 50%;
          height: 50%;
          margin-top: 22%;
        }
      }

      span {
        margin-top: 8px;
      }
    }
  }
}
.qrcode {
  top: 0;
  right: 0;
  cursor: pointer;
  width: 64px;
  height: 64px;
  position: absolute;
  border: 32px solid #ff6900;
  opacity: 0.3;
  border-left-color: rgba(0, 0, 0, 0);
  border-bottom-color: rgba(0, 0, 0, 0);
  .icon {
    position: absolute;
    right: -22px;
    top: -22px;
    width: 36px;
    height: 36px;
  }
}
</style>
