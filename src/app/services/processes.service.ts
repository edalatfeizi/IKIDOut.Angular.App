import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  API_CHANGE_PASSWORD,
  API_CONFIRM_CODE,
  API_GET_APP_PROCESSES,
  API_LOGIN,
  API_LOGOUT,
  API_REFRESH_TOKEN,
  PAGE_SIZE,
} from '../constants/ApiConstants';
import { JWTToken } from '../models/api/request/auth/jwttoken';
import { ConfirmCode } from '../models/api/request/auth/confirm_code';
import { BaseApiResponse } from '../models/api/base_response';
import { ChangePassword } from '../models/api/request/auth/change_password';
import { LoginDto } from '../models/api/request/auth/login_dto';
import { AppProcessResDto } from '../models/api/response/process/app-process';

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
    return this.http.get<BaseApiResponse<AppProcessResDto[]>>(
      API_GET_APP_PROCESSES,
      httpOptions
    );
  }
  
}
