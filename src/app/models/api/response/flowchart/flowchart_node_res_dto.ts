import { NodeType } from '../../../../enums/node_type';
import { TaskConfirmationType } from '../../../../enums/task_confirmation_type';
import { TaskType } from '../../../../enums/task_type';
import { BaseDto } from '../../base_dto';

export interface FlowchartNodeResDto extends BaseDto {
  flowchartId: number;
  nodeType: NodeType;
  taskType: TaskType;
  taskConfirmationType: TaskConfirmationType;
  label: string;
  expression: string;
}
