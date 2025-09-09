import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
    HttpStatusCode,
  } from '@angular/common/http';
  import { inject } from '@angular/core';
  import { Observable, catchError, switchMap, throwError } from 'rxjs';
  
  import { StorageService } from '../services/storage.service';
  
  import {
    ERR_INTERNAL_SERVER,
    ERR_NO_NETWORK_CONNECTION,
    ERR_SERVER_NOT_RESPOND,
    ERR_UN_AUTHORIZED_ACCESS,
    MSG_CALL_SYSTEM,
  } from '../constants/Messages';
  
  import { ValidationErrorResDto } from '../models/api/response/validation_error_res_dto';
import { AuthService } from '../services/account.service';
import { ToastService } from '../services/toast.service';

  export const httpInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
  ): Observable<HttpEvent<unknown>> => {
    const storageService = inject(StorageService);
    const authService = inject(AuthService);
    const toastService = inject(ToastService);
  
    return next(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case HttpStatusCode.Unauthorized:
              return handle401Error(req, next, storageService, authService, toastService);
  
            case HttpStatusCode.Forbidden:
              handle403Error(req, storageService, toastService);
              break;
  
            case HttpStatusCode.BadRequest:
              handle400Error(error, toastService);
              break;
            case HttpStatusCode.InternalServerError:
              toastService.showError(`${ERR_INTERNAL_SERVER}: ${error.message}`);
              break;
  
            default:
              handleNoResponseError(toastService);
          }
        }
        return throwError(() => error);
      })
    );
  };

  function handleNoResponseError(toastService: ToastService) {
    if (!navigator.onLine) {
      toastService.showError(`${ERR_NO_NETWORK_CONNECTION}<br>${MSG_CALL_SYSTEM}`);
    } else {
      toastService.showError(`${ERR_SERVER_NOT_RESPOND}<br>${MSG_CALL_SYSTEM}`);
    }
  }
  
  function handle403Error(req: HttpRequest<unknown>, storageService: StorageService, toastService: ToastService) {
    if (!storageService.shouldLogout()) {
      storageService.setShouldLogOut(true);
      toastService.showError(`${ERR_UN_AUTHORIZED_ACCESS}\n${req.url}`);
      // TODO: Dispatch logout event via NgRx store
    }
  }
  
  function handle400Error(error: HttpErrorResponse, toastService: ToastService) {
    const errorModelStr = error.error?.errors?.ErrorModel?.[0];
    if (errorModelStr) {
      try {
        const parsed = JSON.parse(errorModelStr);
        const errorModel: ValidationErrorResDto = {
          title: decodeUnicode(parsed.Title),
          description: decodeUnicode(parsed.Description),
        };
        toastService.showWarning(`${errorModel.title}\n${errorModel.description}`);
      } catch (ex) {
        console.error('Invalid validation error format', ex);
      }
    }
  }
  
  function handle401Error(
    request: HttpRequest<unknown>,
    next: HttpHandlerFn,
    storageService: StorageService,
    authService: AuthService,
    toastService: ToastService
  ): Observable<HttpEvent<unknown>> {
    if(!storageService.isLoggedIn()){
      toastService.showError(ERR_UN_AUTHORIZED_ACCESS);
      return throwError(() => new Error('Unauthorized access: Not logged in'));

    }
    return authService.refreshToken(storageService.getToken()).pipe(
      switchMap((newToken: any) => {
        const newRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken.token}`
          }
        })
        return next(newRequest);
      }),
      catchError((error) => {
        toastService.showError(ERR_UN_AUTHORIZED_ACCESS);
        // TODO: Dispatch logout event via NgRx store
        return throwError(() => error);
      })
    );
  }
  
  function decodeUnicode(str: string): string {
    return str.replace(/\\u[\dA-F]{4}/gi, (match) =>
      String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
    );
  }
  