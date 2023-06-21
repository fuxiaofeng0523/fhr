import type { ComponentPublicInstance } from 'vue'
import { ElMessage } from 'element-plus'
export default {
  errorHandler(err: unknown, vm: ComponentPublicInstance | null, info: string) {
    // 处理错误
    // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    if (err instanceof Error) {
      ElMessage.error(err.message)
      console.log('❌ 提示:', err.message, vm, info)
    }
  },
  /*
  message：错误信息（字符串）。可用于HTML onerror=""处理程序中的 event。
  source：发生错误的脚本URL（字符串）
  lineno：发生错误的行号（数字）
  colno：发生错误的列号（数字）
  error：Error对象（对象）
  */
  onerror(
    message: string | Event,
    source: string | undefined,
    lineno: number | undefined,
    colno: number | undefined,
    error: object | undefined
  ) {
    console.log('onerror')
    console.log(message, source, lineno, colno, error)
  },

}
