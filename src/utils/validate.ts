// elform验证器

// 验证内容是否是数字
export const validateNumber = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('内容不能为空'))
  } else {
    if (isNaN(value)) {
      callback(new Error('请输入数字'))
    } else {
      callback()
    }
  }
}
// 验证手机号
export const validatePhone = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('内容不能为空'))
  } else {
    if (!/^(?:(?:\+|00)86)?1\d{10}$/.test(value)) {
      callback(new Error('请输入正确的手机号'))
    } else {
      callback()
    }
  }
}

// 验证身份证号
export const validateIdCard = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('内容不能为空'))
  } else {
    if (
      !/^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/.test(
        value
      )
    ) {
      callback(new Error('请输入正确的身份证号'))
    } else {
      callback()
    }
  }
}
