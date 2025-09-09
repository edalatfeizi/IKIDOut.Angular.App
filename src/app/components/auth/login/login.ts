import { Component } from '@angular/core';
import { Err_Enter_Password, Err_Enter_User_Name } from '../../../constants/Messages';
import { LoginDto } from '../../../models/api/request/auth/login_dto';
import { AuthService } from '../../../services/account.service';
import { StorageService } from '../../../services/storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenData } from '../../../models/token_data';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadTokenSuccess } from '../../../states/actions/user_token.actions';
import { showToast } from '../../../states/actions/toast.actions';
import { ToastTypes } from '../../../enums/toast_types';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  showPassword = false;
  errorMessage = '';
  isLoginEnabled = true;
  isLoading = false;
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private store: Store
  ) {}
  validate(userName: string, password: string) {
    if (userName === '') {
      // this.errorMessage = Err_Enter_User_Name;
      this.showMessage(Err_Enter_User_Name,ToastTypes.DANGER);
    } else if (password === '') {
      // this.errorMessage = Err_Enter_Password;
      this.showMessage(Err_Enter_Password,ToastTypes.DANGER)
    } else {
      this.errorMessage = '';
      this.isLoginEnabled = false;
      this.isLoading = true;
      var loginData: LoginDto = {
        UserName: userName,
        Password: password,
      };
      this.login(loginData);
    }
  }
  showMessage(message: string, toastType: ToastTypes) {
    this.store.dispatch(
      showToast({ toastModel: { toastType: toastType, message: message } })
    );
  }
  login(login: LoginDto) {
    this.authService.login(login).subscribe({
      next: (data) => {
        if (data.succeed) {
          this.storageService.saveToken(data.data);
          this.storageService.setLoggedIn(true);
          this.storageService.setPassChanged(data.data.isPasswordChanged);
          this.storageService.setShouldLogOut(false);

          //this.store.dispatch(loadToken({loading: true}))
          var token = this.storageService.getToken().token;
          if (token != null) {
            const jwtHelper = new JwtHelperService();

            const decodedToken = jwtHelper.decodeToken(token);
            let tokenData: TokenData = {
              userId: decodedToken['Id'],
              roles: decodedToken['roles'],
              permissions: decodedToken['permissions'],
              name: decodedToken['name'],
              family_name: decodedToken['family_name'],
              unique_name: decodedToken['unique_name'],
              nationalCode: decodedToken['NationalCode'],
            };
            //this.tokenData = tokenData
            this.store.dispatch(loadTokenSuccess({ tokenData: tokenData }));
          }
          // this.router.navigate(['./auth/confirmcode'])
          this.router.navigate(['./auth/confirmcode'], {
            state: { mobile: login.UserName },
            replaceUrl: true,
          });
        } else {
          this.store.dispatch(
            showToast({ toastModel: { toastType: ToastTypes.DANGER, message: data.message } })
          );

          // this.eventService.showServerError(data)
        }
        this.isLoading = false;
        this.isLoginEnabled = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.isLoginEnabled = true;
        this.router.navigate(['./error/connection']);

        // this.store.dispatch(
        //   showToast({ toastModel: { toastType: ToastTypes.WARNING, message: 'Login failed' } })
        // );

        //this.isLoginFailed = false;
      },
    });
  }
}
