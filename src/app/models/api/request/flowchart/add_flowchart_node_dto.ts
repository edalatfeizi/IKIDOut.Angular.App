import { NodeType } from '../../../../enums/node_type';
import { TaskType } from '../../../../enums/task_type';

export type AddFlowchartNodeDto = {
  FlowchartId: number;
  BPMSNodeType: NodeType;
  TaskType: TaskType;
  Label: string;
  Expression: string;
};
