export enum TaskConfirmationType {
  None = 0,
  ConfirmByPerson = 1,
  ConfirmByRequesterDepAdmin = 2,
  ConfirmByJobPost = 3,
}

export const TaskConfirmationTypeLabels: Record<TaskConfirmationType, string> = {
  [TaskConfirmationType.None]: 'تایید توسط سیستم',
  [TaskConfirmationType.ConfirmByPerson]: 'تایید توسط شخص',
  [TaskConfirmationType.ConfirmByRequesterDepAdmin]: 'تایید توسط مدیر واحد درخواست کننده',
  [TaskConfirmationType.ConfirmByJobPost]: 'تایید توسط پست',
};



