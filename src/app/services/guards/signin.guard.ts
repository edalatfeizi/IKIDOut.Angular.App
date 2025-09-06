import { inject } from "@angular/core"
import { CanActivateFn, Router } from "@angular/router"
import { StorageService } from "../storage.service"

export const signInGuard: CanActivateFn = (route, state) => {
  var router = inject(Router)
  var storageService = inject(StorageService)
  if (storageService.isLoggedIn() && storageService.isConfirmed())
    router.navigateByUrl('/')
  //else router.navigateByUrl('auth/signin')
  return true
}
