// 将后端返回数据处理成el-tree格式

export const formatElTree = (menus: Menu[]) => {
  const fn = (menus: Menu[]) => {
    let result = []
    for (let i = 0; i < menus.length; i++) {
      let tree: AuthTree = {
        id: 0,
        label: ''
      }
      for (const key in menus[i]) {
        if (key === 'name') {
          ;(tree as any)['label'] = menus[i][key]
        } else if (key === 'children') {
          ;(tree as any)[key] = fn(menus[i][key]!)
        } else {
          ;(tree as any)[key] = (menus as any)[i][key]
        }
      }
      result[i] = tree
    }
    return result
  }
  return fn(menus)
}
