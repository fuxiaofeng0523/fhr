interface LoginMessage {
  phone: string
  password: string
  code: string
}

interface Pagination {
  page: number
  pageSize: number
  isDelete?: boolean
}

interface RenderDialogData {
  visible: boolean
  disabled: boolean
  key: string
  component: SFCWithInstall
  optionData?: Option[]
  type?: string
  [propName: string]: any
}

interface Option {
  label: string
  value: string | number
}

interface Menu {
  id: number
  name: string
  path: string
  children: Menu[]
}
interface AuthTree {
  id: number
  label: string
  children?: Tree[]
}

interface RenderKey {
  label: string
  prop: string
  width?: string
}
