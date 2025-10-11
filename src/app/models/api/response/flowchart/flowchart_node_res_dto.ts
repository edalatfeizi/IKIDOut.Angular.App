import { NodeType } from '../../../../enums/node_type';
import { BaseDto } from '../../base_dto';

export interface FlowchartNodeResDto extends BaseDto {
  flowchartId: number;
  type: NodeType;
  label: string;
  expression: string;
}
