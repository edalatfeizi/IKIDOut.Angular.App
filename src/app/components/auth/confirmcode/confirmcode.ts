import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmCode } from '../../../models/api/request/auth/confirm_code';
import { AuthService } from '../../../services/account.service';
import { Store } from '@ngrx/store';
import { showToast } from '../../../states/actions/toast.actions';
import { ToastTypes } from '../../../enums/toast_types';
import { ERR_CANNOT_CONNECT_SERVER, ERR_CONFIRM_CODE_FAILED, MSG_LOGIN_SUCCESS, MSG_VERIFICATION_CODE_SENT } from '../../../constants/Messages';
import { Router } from '@angular/router';
import { interval, Subscription, take } from 'rxjs';
import { formatTime } from '../../utils/utils';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-confirmcode',
  imports: [CommonModule, FormsModule],
  templateUrl: './confirmcode.html',
  styleUrl: './confirmcode.css',
})
export class Confirmcode implements OnInit {
  mobile = '';
  confirmCode: string[] = ['', '', '', '', ''];
  isLoading = false;

  showTimer = true
  countdown: number = 0
  displayCountdown: string | null = null
  countdownSubscription: Subscription | null = null
  constructor(private authService: AuthService, private store: Store, private router: Router, private storageService: StorageService) {}
  ngOnInit(): void {
    this.mobile = history.state.mobile;
    this.mobile = `${this.mobile.substring(
      this.mobile.length - 2,
      this.mobile.length
    )}*****${this.mobile.substring(0, 4)}`;

      this.getCode()

      const countdownDuration = 2 * 60
  
      // Calculate remaining countdown time
      this.countdown = Number.parseInt(Math.max(countdownDuration, 0).toFixed(0))
  
      this.startCountdown(this.countdown)

  }

  moveToNext(currentInput: HTMLInputElement, nextInput: HTMLInputElement | null): void {
    if (currentInput.value.length === 1) {
      if (nextInput) {
        nextInput.focus();
      }
    }
  }
  handleBackspace(
    event: KeyboardEvent,
    currentIndex: number,
    currentInput: HTMLInputElement,
    previousInput: HTMLInputElement | null
  ): void {
    if (event.key === 'Backspace') {
      // this.errorMessage = null;

      this.confirmCode[currentIndex] = '';

      if (previousInput) {
        previousInput.focus();
      }

      // Prevent the default backspace action (e.g., navigating back in the browser)
      event.preventDefault();
    }
  }
  validate() {
    if (
      !this.confirmCode.includes('') //check if there is no empty item
    ) {
      var code: ConfirmCode = {
        Code: `${this.confirmCode.join('')}`,
      };
      this.verifyCode(code);
    }
  }

  verifyCode(confirmCode: ConfirmCode) {
    this.isLoading = true;
    this.authService.confirmCode(confirmCode).subscribe({
      next: (data) => {
        this.isLoading = false;

        if (data.succeed && data.data) {
          this.storageService.setConfirmed(true)
        //  if (this.storageService.isPassChanged()) {
            this.showToast(MSG_LOGIN_SUCCESS, ToastTypes.SUCCESS)
            this.storageService.setTokenSavedTime(Date.now().toString())
            //this.eventService.notifyTokenSavedTime()
            this.router.navigate(['/'], { replaceUrl: true })
          //} else {
            // this.location.replaceState('./auth/change/password');
            //this.router.navigate(['./auth/change/password'], { replaceUrl: true })
    
            // this.router.navigate(['./auth/change/password'])
         // }
          //this.router.navigate(['/'])

        } else if (data.succeed && data.data == false) {
          // this.errorMessage = ERR_CONFIRM_CODE_FAILED

          this.showToast(ERR_CONFIRM_CODE_FAILED, ToastTypes.DANGER);
        } else if (data.data == null) {
          this.showToast(data.message, ToastTypes.DANGER);

        }
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  resendCode() {
    this.getCode()
    this.showTimer = true
    this.startCountdown(this.countdown)
  }
  getCode() {
    this.isLoading = true
    this.authService.getConfirmCode().subscribe({
      next: (data) => {
        this.isLoading = false
        if (data.succeed) {
          this.showToast( MSG_VERIFICATION_CODE_SENT, ToastTypes.SUCCESS)
        } else {
          this.showToast( data.message, ToastTypes.SUCCESS)

        }
      },
      error: (err) => {
        this.isLoading = false
        this.showToast( ERR_CANNOT_CONNECT_SERVER, ToastTypes.SUCCESS)

      },
    })
  }
  showLogin() {
    this.router.navigate(['./auth/login'], { replaceUrl: true })
  }
  startCountdown(seconds: number) {
    this.stopCountdown()

    const countdown$ = interval(1000).pipe(take(seconds))
    this.countdownSubscription = countdown$.subscribe({
      next: (tick) => {
        this.displayCountdown = formatTime(seconds - tick - 1)
      },
      complete: () => {
        this.showTimer = false
      },
    })
  }
  stopCountdown() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe()
      this.countdownSubscription = null
    }
  }

  showToast(message: string, toastType: ToastTypes) {
    this.store.dispatch(
      showToast({ toastModel: { toastType: toastType, message: message } })
    );
  }
}
