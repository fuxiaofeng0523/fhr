export const TOKEN_TIME = 'fhr-tokenTime'

export const TOKEN_TIME_VALUE = 7 * 60 * 60 * 24 * 1000

export const TOKEN = 'fhr-token'

// 登录时设置时间
export const setTokenTime = () => {
  localStorage.setItem(TOKEN_TIME, Date.now().toString())
}
// 获取
export const getTokenTime = () => {
  return localStorage.getItem(TOKEN_TIME)
}
// 是否已经过期
export const diffTokenTime = () => {
  const currentTime = Date.now()
  const tokenTime = getTokenTime()
  return currentTime - Number(tokenTime) > TOKEN_TIME_VALUE
}
// 获取
export const removeTokenTime = () => {
  return localStorage.removeItem(TOKEN_TIME)
}
// 设置token
export const setToken = (token: string) => {
  return localStorage.setItem(TOKEN, token)
}
// 获取token
export const getToken = () => {
  return localStorage.getItem(TOKEN)
}
// 移除token
export const removeToken = () => {
  return localStorage.removeItem(TOKEN)
}
