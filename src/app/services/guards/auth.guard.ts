import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { StorageService } from '../storage.service'

export const authGuard: CanActivateFn = (route, state) => {
  var router = inject(Router)
  var storageService = inject(StorageService)
  if (storageService.isConfirmed())
    return true
  else router.navigateByUrl('auth/login')
  return false
}
