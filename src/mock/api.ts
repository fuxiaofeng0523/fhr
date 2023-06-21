const tokens = {
  '13708171317': {
    password: '123456',
    token: 'admin-token'
  }
}

// get请求从config.url获取参数，post从config.body中获取参数
function paramObj(url: string) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  )
}

const api = [
  // 登陆接口
  {
    url: 'mock-api/login',
    type: 'post',
    response: (config: any) => {
      const { phone, password } = JSON.parse(config.body)
      const user = (tokens as any)[phone]
      if (user.password !== password) {
        return {
          code: 400,
          success: false,
          message: '用户信息错误，请重试~',
          data: {}
        }
      }
      const token = user.token
      if (token) {
        return {
          code: 200,
          message: '登录成功',
          success: true,
          data: {
            access_token: token,
            isAdmin: true
          }
        }
      }
    }
  },
  // 获取用户信息接口
  {
    url: 'mock-api/staff/info',
    type: 'get',
    response: (config: any) => {
      return {
        code: 200,
        message: '登录成功',
        success: true,
        data: {
          data: {
            name: '付小锋'
          }
        }
      }
    }
  }
]
export default api
