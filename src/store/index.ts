import useAppStore from './app'
import useCalendarStore from './calendar'
import useStaffInfosStore from '@/module-staff/store/infos'
import useAdminStore from '@/module-staff/store/admin'
import useApplyStore from '@/module-staff/store/apply'
import useAwardStore from '@/module-staff/store/award'
import useChangeSalaryStore from '@/module-staff/store/changeSalary'
import useTransferStore from '@/module-staff/store/transfer'
import useContractStore from '@/module-staff/store/contract'
import useAwardRuleStore from '@/module-system/store/awardRule'
import useWorkStateStore from '@/module-system/store/workState'
import useDepartmentStore from '@/module-system/store/department'
import useAuthStore from '@/module-system/store/auth'
import useRoleStore from '@/module-system/store/role'
import useJobStore from '@/module-system/store/job'
import useLogStore from '@/module-system/store/log'
import useNoticeStore from '@/module-system/store/notice'
import useAccountStore from '@/module-salary/store/account'
import useSalaryStore from '@/module-salary/store/salary'
import useStaffInfoStore from '@/module-staffInfo/store/staffInfo'
import useSalaryStaStore from '@/module-statistics/store/salary'
import useOperateStore from '@/module-statistics/store/operate'

export default function useStore() {
  return {
    appStore: useAppStore(),
    calendarStore: useCalendarStore(),
    staffInfosStore: useStaffInfosStore(),
    awardRuleStore: useAwardRuleStore(),
    workStateStore: useWorkStateStore(),
    departmentStore: useDepartmentStore(),
    jobStore: useJobStore(),
    accountStore: useAccountStore(),
    authStore: useAuthStore(),
    roleStore: useRoleStore(),
    logStore: useLogStore(),
    noticeStore: useNoticeStore(),
    adminStore: useAdminStore(),
    applyStore: useApplyStore(),
    awardStore: useAwardStore(),
    changeSalaryStore: useChangeSalaryStore(),
    transferStore: useTransferStore(),
    staffInfoStore: useStaffInfoStore(),
    salaryStore: useSalaryStore(),
    salaryStaStore: useSalaryStaStore(),
    operateStore: useOperateStore(),
    contractStore: useContractStore()
  }
}
