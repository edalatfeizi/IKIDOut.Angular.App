  export enum TaskType {
    None = 0,
    SelectProduct = 1,
    SelectProductGroup = 2,
    SelectProductSendOutType = 3
    // ConfirmByDepAdmin = 3,
    // ConfirmByPerson = 4,
    //Expression = 3
  }


  export const TaskTypeLabels: Record<TaskType, string> = {
    [TaskType.None]: 'شروع فرآیند',
    [TaskType.SelectProduct]: 'انتخاب محصول',
    [TaskType.SelectProductGroup]: 'انتخاب گروه کالا',
    [TaskType.SelectProductSendOutType]: 'انتخاب نوع خروج کالا',
    // [TaskType.ConfirmByDepAdmin]: 'تایید توسط مدیر واحد',
    // [TaskType.ConfirmByPerson]: 'تایید توسط شخص',
   // [NodeType.Expression]: 'Expressions',
  };