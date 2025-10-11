import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  API_FLOWCHARTS,
  API_GET_APP_FLOWCHARTS,
  API_GET_APP_PROCESSES,
  API_PROCESSES,
} from '../constants/ApiConstants';
import { BaseApiResponse } from '../models/api/base_response';
import { AppProcessResDto } from '../models/api/response/process/app-process-res-dto';
import { AddProcessDto } from '../models/api/request/process/add-process-dto';
import { NewProcessStepDto } from '../models/api/request/process/new-process-step-dto';
import { ProcessStepResDto } from '../models/api/response/process/process-step-res-dto';
import { UpdateProcessDto } from '../models/api/request/process/update-process-dto';
import { UpdateProcessStepDto } from '../models/api/request/process/update-process-step-dto';
import { FlowchartResDto } from '../models/api/response/flowchart/flowchart_res_dto';
import { AddFlowchartDto } from '../models/api/request/flowchart/add_flowchart_dto';
import { UpdateFlowchartDto } from '../models/api/request/flowchart/update_flowchart_dto';
import { UpdateFlowchartNodeDto } from '../models/api/request/flowchart/update_flowchart_node_dto';
import { FlowchartNodeResDto } from '../models/api/response/flowchart/flowchart_node_res_dto';
import { AddFlowchartNodeDto } from '../models/api/request/flowchart/add_flowchart_node_dto';
import { FlowchartMermaidResDto } from '../models/api/response/flowchart/flowchart_mermaid_res_dto';
import { FlowchartEdgeResDto } from '../models/api/response/flowchart/flowchart_edge_res_dto';
import { AddFlowchartEdgeDto } from '../models/api/request/flowchart/add_flowchart_edge_dto';

// const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class FlowChartService {
  constructor(private http: HttpClient) {}

  getAppFlowcharts(): Observable<BaseApiResponse<FlowchartResDto[]>> {
    return this.http.get<BaseApiResponse<FlowchartResDto[]>>(API_GET_APP_FLOWCHARTS, httpOptions);
  }
  getFlowchartMermaid(id: number): Observable<BaseApiResponse<FlowchartMermaidResDto>> {
    return this.http.get<BaseApiResponse<FlowchartMermaidResDto>>(`${API_FLOWCHARTS}/${id}/mermaid`, httpOptions);
  }
  getFlowchart(id: number): Observable<BaseApiResponse<FlowchartResDto>> {
    return this.http.get<BaseApiResponse<FlowchartResDto>>(`${API_FLOWCHARTS}/${id}`, httpOptions);
  }
  addFlowchart(flowchart: AddFlowchartDto): Observable<BaseApiResponse<FlowchartResDto>> {
    return this.http.post<BaseApiResponse<FlowchartResDto>>(API_FLOWCHARTS, flowchart, httpOptions);
  }

  updateFlowchart(
    flowchartId: number,
    flowchart: UpdateFlowchartDto
  ): Observable<BaseApiResponse<FlowchartResDto>> {
    return this.http.put<BaseApiResponse<FlowchartResDto>>(
      `${API_FLOWCHARTS}/${flowchartId}`,
      flowchart,
      httpOptions
    );
  }

  deleteFlowchart(flowchartId: number): Observable<BaseApiResponse<FlowchartResDto>> {
    return this.http.delete<BaseApiResponse<FlowchartResDto>>(
      `${API_FLOWCHARTS}/${flowchartId}`,
      httpOptions
    );
  }

  addNode(node: AddFlowchartNodeDto): Observable<BaseApiResponse<FlowchartNodeResDto>> {
    return this.http.post<BaseApiResponse<FlowchartNodeResDto>>(`${API_FLOWCHARTS}/node`, node, httpOptions);
  }
  addEdge(edge: AddFlowchartEdgeDto): Observable<BaseApiResponse<FlowchartEdgeResDto>> {
    return this.http.post<BaseApiResponse<FlowchartEdgeResDto>>(`${API_FLOWCHARTS}/edge`, edge, httpOptions);
  }
  updateNode(
    id: number,
    node: UpdateFlowchartNodeDto
  ): Observable<BaseApiResponse<FlowchartNodeResDto>> {
    return this.http.put<BaseApiResponse<FlowchartNodeResDto>>(
      `${API_FLOWCHARTS}/node/${id}`,
      node,
      httpOptions
    );
  }

  deleteNode(nodeId: number): Observable<BaseApiResponse<FlowchartNodeResDto>> {
    return this.http.delete<BaseApiResponse<FlowchartNodeResDto>>(
      `${API_FLOWCHARTS}/node/${nodeId}`,
      httpOptions
    );
  }
}
