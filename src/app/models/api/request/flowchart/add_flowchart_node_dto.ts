import { NodeType } from '../../../../enums/node_type';
import { TaskConfirmationType } from '../../../../enums/task_confirmation_type';
import { TaskType } from '../../../../enums/task_type';

export type AddFlowchartNodeDto = {
  FlowchartId: number;
  NodeType: NodeType;
  TaskType: TaskType;
  TaskConfirmationType: TaskConfirmationType;
  Label: string;
  Expression: string;
  ConfirmByPersonCode: string | null;
  ConfirmByJobPostId: number | null;
};
