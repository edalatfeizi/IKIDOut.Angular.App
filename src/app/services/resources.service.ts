import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import {
  API_DOWNLOAD_PERSON_IMAGE_URL,
} from '../constants/ApiConstants'

@Injectable({
  providedIn: 'root',
})
export class ResourcesService {
  constructor(private http: HttpClient) {}

  // getImage(fileId: number): Observable<Blob> {
  //   return this.http.get(`${API_DOWNLOAD_IMAGE_URL}/${fileId}`, {
  //     responseType: 'blob',
  //   })
  // }

  getPersonImage(nationalCode: string): Observable<Blob> {
    return this.http.get(
      `${API_DOWNLOAD_PERSON_IMAGE_URL}?nationalCode=${nationalCode}`,
      { responseType: 'blob' }
    )
  }
}
