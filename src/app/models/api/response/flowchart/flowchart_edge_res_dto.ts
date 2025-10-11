import { BaseDto } from '../../base_dto';

export interface FlowchartEdgeResDto extends BaseDto {
  flowchartId: number;
  sourceNodeId: number;
  targetNodeId: number;
  label: string;
}
