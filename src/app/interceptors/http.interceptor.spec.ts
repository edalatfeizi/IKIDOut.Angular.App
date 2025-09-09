import { EnvironmentInjector, runInInjectionContext } from '@angular/core'
import { AuthService } from '../services/auth.service'
import { StorageService } from '../services/storage.service'
import { ToastService } from '../services/toast.service'
import { TestBed } from '@angular/core/testing'
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http'
import { of, throwError } from 'rxjs'
import { httpInterceptor } from './http.interceptor'

describe('httpInterceptor', () => {
  let storageService: jest.Mocked<StorageService>
  let authService: jest.Mocked<AuthService>
  let toastService: jest.Mocked<ToastService>

  let injector: EnvironmentInjector

  beforeEach(() => {
    storageService = {
      isLoggedIn: jest.fn(),
      getToken: jest.fn(),
      shouldLogout: jest.fn(),
      setShouldLogOut: jest.fn(),
    } as any

    authService = {
      refreshToken: jest.fn(),
    } as any

    toastService = {
      showError: jest.fn(),
      showWarning: jest.fn(),
      showSuccess: jest.fn(),
      // showToast: jest.fn(),
      // showInfo: jest.fn(),
    }

    injector = TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageService },
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService },
      ],
    }).inject(EnvironmentInjector)
  })

  it('should handle 401 error and call refresh token', (done) => {
    const request = new HttpRequest('GET', '/test')
    const handler = jest
      .fn()
      .mockImplementationOnce(() =>
        throwError(() => new HttpErrorResponse({ status: 401 }))
      )
      .mockImplementationOnce(() => of({ body: 'success' }))

    storageService.isLoggedIn.mockReturnValue(true)
    storageService.getToken.mockReturnValue({
      token: 'dummy-token',
      refreshToken: '',
      result: true,
      isPasswordChanged: false,
    })
    authService.refreshToken.mockReturnValue(
      of({
        succeed: true,
        responseCode: 200,
        message: 'success',
        currentPage: 1,
        pageSize: 1,
        totalCount: 1,
        data: {
          token: 'dummy-token',
          refreshToken: '',
          result: true,
          isPasswordChanged: false,
        },
      })
    )
 

    runInInjectionContext(injector, () => {
      httpInterceptor(request, handler).subscribe({
        next: (response) =>{
            expect(authService.refreshToken).toHaveBeenCalledWith({
                token: 'dummy-token',
                refreshToken: '',
                result: true,
                isPasswordChanged: false,
              })
              expect(handler).toHaveBeenCalledTimes(2)
              expect(toastService.showError).not.toHaveBeenCalled()
              done()
        },
        error:(err) => {
            done.fail(err)
        }
      })
    })
  })
})

//mock services
// jest.mock('../services/storage.service')
// jest.mock('../services/auth.service')
// jest.mock('../services/toast.service')

// const mockStorageService = new StorageService() as jest.Mocked<StorageService>
// const mockAuthService = new AuthService() as jest.Mocked<AuthService>
// const mockToastService = new ToastService() as jest.Mocked<ToastService>
