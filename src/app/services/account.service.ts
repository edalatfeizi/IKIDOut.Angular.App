import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  API_CHANGE_PASSWORD,
  API_CONFIRM_CODE,
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

// const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  /** Auth Start*/
  login(login: LoginDto): Observable<BaseApiResponse<JWTToken>> {
    return this.http.post<BaseApiResponse<JWTToken>>(
      API_LOGIN,
      login,
      httpOptions
    );
  }
  // register(username: string, email: string, password: string): Observable<any> {
  //   return this.http.post(
  //     AUTH_API + 'signup',
  //     {
  //       username,
  //       email,
  //       password,
  //     },
  //     httpOptions
  //   );
  // }
  changePassword(
    changePassword: ChangePassword
  ): Observable<BaseApiResponse<boolean>> {
    return this.http.post<BaseApiResponse<boolean>>(
      API_CHANGE_PASSWORD,
      changePassword,
      httpOptions
    );
  }
  confirmCode(confirmCode: ConfirmCode): Observable<BaseApiResponse<boolean>> {
    return this.http.post<BaseApiResponse<boolean>>(
      API_CONFIRM_CODE,
      confirmCode,
      httpOptions
    );
  }
  getConfirmCode(): Observable<BaseApiResponse<boolean>> {
    return this.http.get<BaseApiResponse<boolean>>(
      API_CONFIRM_CODE,
      httpOptions
    );
  }
  logout() {
    return this.http.get<BaseApiResponse<boolean>>(API_LOGOUT);
  }

  refreshToken(savedToken: JWTToken): Observable<BaseApiResponse<JWTToken>> {
    return this.http.post<BaseApiResponse<JWTToken>>(
      API_REFRESH_TOKEN,
      savedToken,
      httpOptions
    );
  }
  /** Auth End*/
}
