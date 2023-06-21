import { ElLoading } from 'element-plus'
import { DARK_KEY } from '@/layout/utils/constant'
const isDark: boolean = localStorage.getItem(DARK_KEY) === 'dark'
let elLoading: { close: () => void }
function openLoading() {
  elLoading = ElLoading.service({
    body: true,
    lock: true,
    text: 'Loading…',
    background: `${isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'} `
  })
}
function closeLoading() {
  elLoading.close()
}

export { openLoading, closeLoading }
