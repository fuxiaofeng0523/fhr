import { ApplyStateEnum } from '@/enums/apply'

export const formatStaff = (staff: CreateStaff | Staff) => {
  const {
    sex,
    wedlock,
    nation,
    politicalAffiliation,
    department,
    job,
    basisSalary,
    engageForm,
    educationLevel,
    workState,
    contractDate,
    formDate,
    leaveDate,
    beginDate,
    endDate,
    workAge,
    ...rest
  } = staff

  const newStaff = {
    ...rest,
    departmentId: Number(department),
    jobId: Number(job),
    engageForm: Number(engageForm),
    beginDate: beginDate
  }
  formDate && ((newStaff as any)['formDate'] = formDate)
  leaveDate && ((newStaff as any)['leaveDate'] = leaveDate)
  endDate && ((newStaff as any)['endDate'] = endDate)
  sex && ((newStaff as any)['sex'] = Number(sex))
  workAge && ((newStaff as any)['workAge'] = Number(workAge))
  contractDate && ((newStaff as any)['contractDate'] = Number(contractDate))
  workState && ((newStaff as any)['workStateId'] = Number(workState))
  wedlock && ((newStaff as any)['wedlock'] = Number(wedlock))
  nation && ((newStaff as any)['nation'] = Number(nation))
  basisSalary && ((newStaff as any)['basisSalary'] = Number(basisSalary))
  educationLevel &&
    ((newStaff as any)['educationLevel'] = Number(educationLevel))
  politicalAffiliation &&
    ((newStaff as any)['politicalAffiliation'] = Number(politicalAffiliation))
  return newStaff
}

export const selectApplyStateTagType = (applyState: number) => {
  switch (applyState) {
    case ApplyStateEnum['审核中']:
      return 'warning'
    case ApplyStateEnum['审核通过']:
      return 'success'
    case ApplyStateEnum['审核未通过']:
      return 'danger'
  }
}
