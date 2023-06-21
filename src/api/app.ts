import request from './request'

// 登录接口
export const loginApi = (data: LoginMessage) => request.post('/login', data)

// 获取用户信息
export const getUserInfoApi = () => request.get('staff/info')

// 登出
export const logoutApi = () => request.get('/logout')

// 获取菜单
export const getMenuApi = (isAdminNow: boolean) =>
  request.get('/auth/menu', { params: { isAdminNow: String(isAdminNow) } })

// 上传
export const uploadApi = (file: FormData) =>
  request.post('upload', file, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
