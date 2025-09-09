import { inject, Inject, Injectable } from '@angular/core'
import { MSG_Error, MSG_Success, MSG_Warning } from '../constants/Messages'
// import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar'
import { DOCUMENT } from '@angular/common'
import { STR_CLOSE } from '../constants/string_resources'
import { TOAST_DURATION } from '../constants/app_constants'
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(
    // private snackBar: MatSnackBar,
    @Inject(DOCUMENT) private document: Document
  ) {}

  showSuccess(message: string, duration = TOAST_DURATION): string {
    // this.snackBar.open(
    //   message,
    //   STR_CLOSE,
    //   this.getSnackBarConfig(duration, 'success-toast')
    // )   
    return message
  }

  showError(message: string, duration = TOAST_DURATION): string{
    // this.snackBar.open(
    //   message,
    //   STR_CLOSE,
    //   this.getSnackBarConfig(duration, 'error-toast')
    // )
    return message
  }

  showWarning(message: string, duration = TOAST_DURATION): string {
    // this.snackBar.open(
    //   message,
    //   STR_CLOSE,
    //   this.getSnackBarConfig(duration, 'warning-toast')
    // )
    return message
  }

  // private getDirection(): MatSnackBarConfig['direction'] {
  //   return this.document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr'
  // }
  // private getSnackBarConfig(
  //   duration: number,
  //   panelCSSClass: string
  // ): MatSnackBarConfig {
  //   const snackBarCfg: MatSnackBarConfig = {
  //     duration,
  //     panelClass: [panelCSSClass],
  //     horizontalPosition: this.getDirection() === 'rtl' ? 'left' : 'right',
  //     verticalPosition: 'top',
  //     direction: this.getDirection(),
  //   }
  //   return snackBarCfg
  // }
}
