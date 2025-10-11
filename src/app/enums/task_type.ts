  export enum TaskType {
    None = 0,
    SelectProduct = 1,
    SelectProductGroup = 2,
    ConfirmByDepAdmin = 3,
    ConfirmByPerson = 4,
    //Expression = 3
  }


  export const TaskTypeLabels: Record<TaskType, string> = {
    [TaskType.None]: 'پیش فرض',
    [TaskType.SelectProduct]: 'انتخاب محصول',
    [TaskType.SelectProductGroup]: 'انتخاب گروه کالا',
    [TaskType.ConfirmByDepAdmin]: 'تایید توسط مدیر واحد',
    [TaskType.ConfirmByPerson]: 'تایید توسط شخص',
   // [NodeType.Expression]: 'Expressions',
  };