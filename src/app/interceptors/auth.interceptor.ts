import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http'
import { inject } from '@angular/core'
import { Observable } from 'rxjs'
import { StorageService } from '../services/storage.service'
const USER_JWT_TOKEN = 'ikidout_user_jwt_token'
export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  let storageService = inject(StorageService)
  let token = storageService.getToken().token

  if (token != null) {
    const clonedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
    //console.log(`Authorization Header: ${clonedRequest.headers.get("Authorization")}`)
    return next(clonedRequest)
  }
  return next(request)
}
