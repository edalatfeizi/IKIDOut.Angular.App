import { BaseDto } from '../../base_dto';
import { FlowchartEdgeResDto } from './flowchart_edge_res_dto';
import { FlowchartNodeResDto } from './flowchart_node_res_dto';

export interface FlowchartResDto extends BaseDto {
  name: string;
  description: string;
  nodes: FlowchartNodeResDto[];
  edges: FlowchartEdgeResDto[];
  flowcharDef: string;
}
