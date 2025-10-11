import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {
  API_GET_DEPARTMENTS,
  API_GET_EMP_ALL_SHARED_FOLDERS_BY_ALL_USERS,
  API_GET_ENGAGE_TYPES,
  API_GET_PERSONS,
  PAGE_SIZE,
} from '../constants/ApiConstants'

import { BaseApiResponse } from '../models/api/base_response'
import { PersonDto } from '../models/api/response/person/person_dto'
import { FilterPersonel } from '../models/api/request/personely/filter_personel_dto'

// const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}

@Injectable({
  providedIn: 'root',
})
export class PersonelyService {
  constructor(private http: HttpClient) {}

  getPersons(activePersons: boolean, page: number, filterPersonel :FilterPersonel) {


    return this.http.post<BaseApiResponse<PersonDto[]>>(
      `${API_GET_PERSONS}?activePersons=${activePersons}&page=${page}&pageSize=${PAGE_SIZE}`,
      filterPersonel
    )
  }

  
}
