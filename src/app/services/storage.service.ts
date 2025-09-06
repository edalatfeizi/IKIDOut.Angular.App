import {
  Inject,
  Injectable,
  isDevMode,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core'
import { JWTToken } from '../models/api/request/auth/jwttoken'
import { isPlatformBrowser } from '@angular/common'

const USER_JWT_TOKEN = 'ikid_out_user_jwt_token'
const USER_JWT_REFRESH_TOKEN = 'ikid_out_user_jwt_refresh_token'
const USER_LOGIN_STATE = 'ikid_out_user_login_state'
const USER_CONFIRMED_STATE = 'ikid_out_user_confirm_state'
const USER_SHOULD_LOGOUT = 'ikid_out_user_should_logout'
const USER_RECENTLY_LOGGED_IN = 'ikid_out_user_recently_logged_in'
const IKID_OUT_IS_PASS_CHANGED = 'ikid_out_is_pass_changed'
const IKID_OUT_TOKEN_SAVED_TIME = 'ikid_out_token_saved_time'
const IKID_OUT_IS_PROFILE_UNLOCKED = 'ikid_out_is_profile_unlocked'

@Injectable({
  providedIn: 'root',
})
export class StorageService implements OnDestroy {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId))
      window.addEventListener('unload', this.unloadHandler)
    // window.addEventListener('beforeunload', this.unloadHandler.bind(this));
  }
  ngOnDestroy(): void {
    // Clean up event listeners when the service is destroyed
    if (isPlatformBrowser(this.platformId))
      window.removeEventListener('unload', this.unloadHandler)
    // window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  }
  unloadHandler(event: Event) {
    this.clean()
  }
  // beforeUnloadHandler(event: Event) {
  //   // this.setBrowserClosed(true)
  // }
  clean(): void {
    //if(!isDevMode())
    sessionStorage.clear()
  }

  public saveToken(jwt: JWTToken): void {
    console.log(jwt)
    if (jwt.token != null && jwt.refreshToken != null) {
      sessionStorage.removeItem(USER_JWT_TOKEN)
      sessionStorage.setItem(USER_JWT_TOKEN, jwt.token)
      sessionStorage.setItem(USER_JWT_REFRESH_TOKEN, jwt.refreshToken)
    }
  }

  public getToken(): JWTToken {
    var jwtToken: JWTToken = {
      token: sessionStorage.getItem(USER_JWT_TOKEN),
      refreshToken: sessionStorage.getItem(USER_JWT_REFRESH_TOKEN),
      result: true,
      isPasswordChanged: this.isPassChanged(),
    }
    return jwtToken
  }
  public setTokenSavedTime(time: string): void {
    sessionStorage.removeItem(IKID_OUT_TOKEN_SAVED_TIME)
    sessionStorage.setItem(IKID_OUT_TOKEN_SAVED_TIME, time)
  }

  public getTokenSavedTime(): string | null {
    var tokenSavedTime = sessionStorage.getItem(IKID_OUT_TOKEN_SAVED_TIME)
    return tokenSavedTime
  }

  public setLoggedIn(isLoggedIn: boolean): void {
    sessionStorage.removeItem(USER_LOGIN_STATE)
    sessionStorage.setItem(USER_LOGIN_STATE, isLoggedIn.toString())
  }
  public isLoggedIn(): boolean {
    const isLoggedIn = sessionStorage.getItem(USER_LOGIN_STATE)
    if (isLoggedIn !== null && isLoggedIn === 'true') {
      return true
    }

    return false
  }
  public setProfileUnLocked(isUnlocked: boolean): void {
    sessionStorage.removeItem(IKID_OUT_IS_PROFILE_UNLOCKED)
    sessionStorage.setItem(IKID_OUT_IS_PROFILE_UNLOCKED, isUnlocked.toString())
  }
  public isProfileUnLocked(): boolean {
    const isUnLocked = sessionStorage.getItem(IKID_OUT_IS_PROFILE_UNLOCKED)
    if (isUnLocked !== null && isUnLocked === 'true') {
      return true
    }

    return false
  }
  public setConfirmed(isConfirmed: boolean): void {
    sessionStorage.removeItem(USER_CONFIRMED_STATE)
    sessionStorage.setItem(USER_CONFIRMED_STATE, isConfirmed.toString())
  }
  public isConfirmed(): boolean {
    const isConfirmed = sessionStorage.getItem(USER_CONFIRMED_STATE)
    if (isConfirmed !== null && isConfirmed === 'true') {
      return true
    }

    return false
  }
  public setPassChanged(isPassChanged: boolean): void {
    sessionStorage.removeItem(IKID_OUT_IS_PASS_CHANGED)
    sessionStorage.setItem(IKID_OUT_IS_PASS_CHANGED, isPassChanged.toString())
  }
  public isPassChanged(): boolean {
    const isPassChanged = sessionStorage.getItem(IKID_OUT_IS_PASS_CHANGED)
    if (isPassChanged !== null && isPassChanged === 'true') {
      return true
    }

    return false
  }

  public setShouldLogOut(shouldLogout: boolean): void {
    sessionStorage.removeItem(USER_SHOULD_LOGOUT)
    sessionStorage.setItem(USER_SHOULD_LOGOUT, shouldLogout.toString())
  }
  public shouldLogout(): boolean {
    const shouldLogout = sessionStorage.getItem(USER_SHOULD_LOGOUT)
    if (shouldLogout !== null && shouldLogout === 'true') {
      return true
    }

    return false
  }
  public setRecentlyLoggedIn(isRecentlyLoggedIn: boolean): void {
    sessionStorage.removeItem(USER_RECENTLY_LOGGED_IN)
    sessionStorage.setItem(
      USER_RECENTLY_LOGGED_IN,
      isRecentlyLoggedIn.toString()
    )
  }
  public isRecentlyLoggedIn(): boolean {
    const isRecentlyLoggedIn = sessionStorage.getItem(USER_RECENTLY_LOGGED_IN)
    if (isRecentlyLoggedIn !== null && isRecentlyLoggedIn === 'true') {
      return true
    }

    return false
  }
}
