import type { Ref } from 'vue'
import { PAGESIZE, PAGE, TOTAL } from '@/utils/constant'
/**
 * @description: 根据时间返回hello信息
 * @return {string} hello信息
 */
export const hello = (): string => {
  const hour = new Date().getHours()
  if (hour >= 0 && hour <= 6) {
    return '已经很晚了，注意休息哦~'
  } else if (hour < 12) {
    return '早上好~'
  } else if (hour < 18) {
    return '下午好~'
  } else if (hour < 24) {
    return '晚上好~'
  } else {
    return '你好~'
  }
}
export const initData = (afterData: Ref<any>, beforeData: any) => {
  for (const key in beforeData) {
    if (Object.prototype.hasOwnProperty.call(beforeData, key)) {
      afterData.value[key] = beforeData[key]
    }
  }
}

// ? 将原始数据转换成el-table需要的数据
export const formatTableData = (data: any) => {
  const result: any[] = []
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      result.push({
        key,
        value: data[key]
      })
    }
  }
  return result
}

// 将enum数据转换成el-option数据
export const formatEnumData = (data: any) => {
  const result: any[] = []
  const keys = Object.keys(data)
  for (const key in data) {
    if (result.length === keys.length / 2) break
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      result.push({
        label: data[key],
        value: key
      })
    }
  }
  return result
}

// 通过Option获取数据label
export const getLabelByOptionData = (id: number, optionData: Option[]) => {
  if (!optionData) return
  const result = optionData.filter(option => option.value === id)
  return result[0] ? result[0].label : undefined
}

// 通过Option获取数据value
export const getValueByOptionData = (name: string, optionData: Option[]) => {
  if (!optionData) return
  const result = optionData.filter(option => option.label === name)
  return result[0] ? (result[0].value as number) : undefined
}

/**
 * 使用span标签包裹内容，然后计算span的宽度 width： px
 * @param valArr
 */
function getTextWidth(str: any) {
  let padding = 0 //单元格左右padding距离
  let width = 0
  let span = document.createElement('span')
  span.innerText = str
  span.className = 'getwidth'
  document.querySelector('body')!.appendChild(span)
  // 这里可以获取当前单元格的font-size 以及 内容的中英文、字母等  做更精确的计算
  width =
    (document.querySelector('.getwidth')! as HTMLSpanElement).offsetWidth +
    padding
  document.querySelector('.getwidth')!.remove()
  return width
}

/**
 * 遍历列的所有内容，获取最宽一列的宽度
 * @param {Array} arr 需要计算的数据
 * @param {Number} minwidth 列最小宽度
 */
function getMaxLength(arr: any, minwidth = 60) {
  return arr.reduce((acc: any, item: any) => {
    if (item) {
      let calcLen = getTextWidth(item)
      if (acc < calcLen) {
        acc = calcLen
      }
    }
    return acc < minwidth ? minwidth : acc
  }, 0)
}

/**
 * @description 计算列表列宽（把内容撑开）
 * @param {Array} columns 列的数组
 * @param {Array} tableArr 列表的数组
 * */
export function calcColumnsWidth(columns: any, tableArr: any) {
  columns.forEach((item: any) => {
    const arr = tableArr.map((x: any) => x[item.prop])
    arr.push(item.label) // 把每列的表头也加进去算
    item.width = getMaxLength(arr)
  })
  return columns
}

// 将string数组转换成{label,prop}数组
export const formatRenderKeys = (
  renderKeys: string[],
  $t: Function,
  key: string
) => {
  return renderKeys.map(item => {
    return { label: item, prop: $t(`${key}.${item}`) }
  })
}

// 初始化数组
export const initArray = (array: any[]) => {
  while (array.length > 0) {
    array.pop()
  }
}

// 初始化分页信息
export const initPagination = (store: any) => {
  store.page = PAGE
  store.pageSize = PAGESIZE
  store.total = TOTAL
}
