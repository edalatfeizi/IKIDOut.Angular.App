import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_SHIPPING_POINTS } from '../constants/ApiConstants';
import { BaseApiResponse } from '../models/api/base_response';
import { ShippingPointResDto } from '../models/api/response/shippingpoints/shipping-point-res-dto';
import { AddShippingPointDto } from '../models/api/request/shippingpoints/add-shipping-point-dto';
import { UpdateShippingPointDto } from '../models/api/request/shippingpoints/update-shipping-point-dto';

// const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ShippingPointsService {
  constructor(private http: HttpClient) {}

  getShippingPoints(): Observable<BaseApiResponse<ShippingPointResDto[]>> {
    return this.http.get<BaseApiResponse<ShippingPointResDto[]>>(API_SHIPPING_POINTS, httpOptions);
  }
  
  getShippingPointById(id: number): Observable<BaseApiResponse<ShippingPointResDto | null>> {
    return this.http.get<BaseApiResponse<ShippingPointResDto>>(
      `${API_SHIPPING_POINTS}/${id}`,
      httpOptions
    );
  }

  deleteShippingPoint(id: number): Observable<BaseApiResponse<ShippingPointResDto | null>> {
    return this.http.delete<BaseApiResponse<ShippingPointResDto>>(
      `${API_SHIPPING_POINTS}/${id}`,
      httpOptions
    );
  }

  addShippingPoint(
    shippingpoint: AddShippingPointDto
  ): Observable<BaseApiResponse<ShippingPointResDto>> {
    return this.http.post<BaseApiResponse<ShippingPointResDto>>(
      API_SHIPPING_POINTS,
      shippingpoint,
      httpOptions
    );
  }

  updateShippingPoint(
    id: number,
    shippingpoint: UpdateShippingPointDto
  ): Observable<BaseApiResponse<ShippingPointResDto>> {
    return this.http.put<BaseApiResponse<ShippingPointResDto>>(
      `${API_SHIPPING_POINTS}/${id}`,
      shippingpoint,
      httpOptions
    );
  }
}
