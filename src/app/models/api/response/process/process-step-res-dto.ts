import { BaseDto } from "../../base_dto"

export interface ProcessStepResDto extends BaseDto{
    name: string
    description: string
    order: number
    roleRequired: string
    processStepTypeId: number
    nextStepId: string
    trueStepId: string
    falseStepId: string
  }
  