import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_GET_APP_PROCESSES, API_PROCESSES } from '../constants/ApiConstants';
import { BaseApiResponse } from '../models/api/base_response';
import { AppProcessResDto } from '../models/api/response/process/app-process-res-dto';
import { AddProcessDto } from '../models/api/request/process/add-process-dto';
import { NewProcessStepDto } from '../models/api/request/process/new-process-step-dto';
import { ProcessStepResDto } from '../models/api/response/process/process-step-res-dto';
import { UpdateProcessDto } from '../models/api/request/process/update-process-dto';
import { UpdateProcessStepDto } from '../models/api/request/process/update-process-step-dto';

// const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AppProcessesService {
  constructor(private http: HttpClient) {}

  getAppProcesses(): Observable<BaseApiResponse<AppProcessResDto[]>> {
    return this.http.get<BaseApiResponse<AppProcessResDto[]>>(API_GET_APP_PROCESSES, httpOptions);
  }

  addProcess(newProcess: AddProcessDto): Observable<BaseApiResponse<AppProcessResDto>> {
    return this.http.post<BaseApiResponse<AppProcessResDto>>(
      API_PROCESSES,
      newProcess,
      httpOptions
    );
  }
  updateProcess(processId: number, process: UpdateProcessDto): Observable<BaseApiResponse<AppProcessResDto>> {
    return this.http.put<BaseApiResponse<AppProcessResDto>>(
      `${API_PROCESSES}/${processId}`,
      process,
      httpOptions
    );
  }
  addProcessStep(processId: number,
    NewProcessStep: NewProcessStepDto
  ): Observable<BaseApiResponse<ProcessStepResDto>> {
    return this.http.post<BaseApiResponse<ProcessStepResDto>>(
      `${API_PROCESSES}/${processId}/step`,
      NewProcessStep,
      httpOptions
    );
  }

  updateProcessStep(processId: number,stepId: number,
    step: UpdateProcessStepDto
  ): Observable<BaseApiResponse<ProcessStepResDto>> {
    return this.http.put<BaseApiResponse<ProcessStepResDto>>(
      `${API_PROCESSES}/${processId}/step/${stepId}`,
      step,
      httpOptions
    );
  }
}
