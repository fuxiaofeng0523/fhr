import { ref, h } from 'vue'
import { defineStore } from 'pinia'
import appStore from './app'
import { ElMessage, ElNotification } from 'element-plus'
import {
  getCalendarApi,
  createCalendarApi,
  updateCalendarApi,
  thoroughDeleteCalendarApi
} from '@/api/calendar'
import moment from 'moment'
export default defineStore('calendar', () => {
  const calendarList = ref<Calendar[]>([])
  const editCalendar = ref<Calendar>()
  const app = appStore()
  // 获取用户日历
  const getCalendar = async (id: number = app.userInfo.id) => {
    const { data } = await getCalendarApi(id)
    if (data.success) {
      calendarList.value = data.data

      calendarList.value.forEach(item => {
        if (item.remindTime !== '0') {
          const timer = setInterval(() => {
            if (
              moment(item.startTime).subtract(item.remindTime, 'minutes') <=
              moment()
            ) {
              ElNotification({
                title: item.title,
                message: h('div', [
                  h(
                    'p',
                    { style: 'color: #f60' },
                    '您有一条日程即将开始，请注意！'
                  ),
                  h('p', `开始时间：${item.startTime}`),
                  h('p', `${item.address ? '地点：' + item.address : ''}`),
                  h('p', `${item.remark ? '备注：' + item.remark : ''}`)
                ]),
                duration: 0,
                onClose: () => {
                  deleteCalendar(item.id)
                }
              })
              clearInterval(timer)
            }
          }, 1000)
        }
      })
    } else throw new Error(data.message)
  }
  // 创建日历
  const createCalendar = async (params: CreateCalendar) => {
    const { data } = await createCalendarApi(params)
    if (data.success) {
      ElMessage.success('添加成功')
      getCalendar()
    } else throw new Error(data.message)
  }
  // 修改日历
  const updateCalendar = async (
    id: number,
    parmas: Partial<CreateCalendar>
  ) => {
    const { data } = await updateCalendarApi(id, parmas)
    if (data.success) {
      ElMessage.success('修改成功')
      getCalendar()
    } else throw new Error(data.message)
  }
  // 删除日历
  const deleteCalendar = async (id: number) => {
    const { data } = await thoroughDeleteCalendarApi([id])
    if (data.success) {
      getCalendar()
    } else throw new Error(data.message)
  }

  return {
    calendarList,
    getCalendar,
    createCalendar,
    editCalendar,
    updateCalendar,
    deleteCalendar
  }
})
