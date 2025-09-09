import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  API_CHANGE_PASSWORD,
  API_CONFIRM_CODE,
  API_GET_PRODUCT_SEND_OUT_FLOWS,
  API_LOGIN,
  API_LOGOUT,
  API_REFRESH_TOKEN,
  PAGE_SIZE,
} from '../constants/ApiConstants';
import { JWTToken } from '../models/api/request/auth/jwttoken';
import { ConfirmCode } from '../models/api/request/auth/confirm_code';
import { BaseApiResponse } from '../models/api/base_response';
import { ChangePassword } from '../models/api/request/auth/change_password';
import { ProductSendOutFlow } from '../models/api/response/flows/product_send_out_flow';

// const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ManageSendOutFlowsService {
  constructor(private http: HttpClient) {}
  /** Auth Start*/
  getAllFlows(): Observable<BaseApiResponse<ProductSendOutFlow[]>> {
    return this.http.get<BaseApiResponse<ProductSendOutFlow[]>>(
      API_GET_PRODUCT_SEND_OUT_FLOWS,
      httpOptions
    );
  }
  
  /** Auth End*/
}
