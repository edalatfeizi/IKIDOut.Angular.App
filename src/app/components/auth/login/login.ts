import { Component } from '@angular/core';
import { Err_Enter_Password, Err_Enter_User_Name } from '../../../constants/Messages';
import { LoginDto } from '../../../models/api/request/auth/login_dto';
import { AccountService } from '../../../services/account.service';
import { StorageService } from '../../../services/storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenData } from '../../../models/token_data';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  showPassword = false
  errorMessage = ''
  isLoginEnabled = true
  isLoading = false
  constructor(
    private authService: AccountService,
    private storageService: StorageService,
    private router: Router,
    private store: Store
  ){

  }
  validate(userName: string, password: string) {
 

    if (userName === '') {
      this.errorMessage = Err_Enter_User_Name
    } else if (password === '') {
      this.errorMessage = Err_Enter_Password
    }
    
    else {
      this.errorMessage = ''
      this.isLoginEnabled = false
      this.isLoading = true
      var loginData: LoginDto = {
        UserName: userName,
        Password: password,
      }
      this.login(loginData)
    }
    
  }

  login(login: LoginDto) {
    this.authService.login(login).subscribe({
      next: (data) => {
        if (data.succeed) {
          this.storageService.saveToken(data.data)
          this.storageService.setLoggedIn(true)
          this.storageService.setPassChanged(data.data.isPasswordChanged)
          this.storageService.setShouldLogOut(false)

          //this.store.dispatch(loadToken({loading: true}))
          var token = this.storageService.getToken().token
          if (token != null) {
            const jwtHelper = new JwtHelperService()

            const decodedToken = jwtHelper.decodeToken(token)
            let tokenData: TokenData = {
              userId: decodedToken['Id'],
              roles: decodedToken['roles'],
              permissions: decodedToken['permissions'],
              name: decodedToken['name'],
              family_name: decodedToken['family_name'],
              unique_name: decodedToken['unique_name'],
              nationalCode: decodedToken['NationalCode'],
            }
            //this.tokenData = tokenData
            this.store.dispatch(loadTokenSuccess({ tokenData: tokenData }))
          }
          // this.router.navigate(['./auth/confirmcode'])
          this.router.navigate(['./auth/confirmcode'], {
            state: { mobile: login.UserName },
            replaceUrl: true,
          })
        } else {
          this.eventService.showServerError(data)
        }
        this.isLoading = false
        this.isLoginEnabled = true
      },
      error: (err) => {
        this.isLoading = false
        this.isLoginEnabled = true

        //this.isLoginFailed = false;
      },
    })
  }
}
