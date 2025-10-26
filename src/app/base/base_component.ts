import {
  Component,
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { ToastTypes } from '../enums/toast_types'
import { ToastModel } from '../models/toast_model'
import { select, Store } from '@ngrx/store'
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs'
import { TokenData } from '../models/token_data'
import { JwtHelperService } from '@auth0/angular-jwt'
import { StorageService } from '../services/storage.service'
import { selectTokenData } from '../states/selectors/login_token.selectors'

//It satisfies Angular's type-checking and linting requirements by explicitly marking the class as part of Angular's ecosystem.
@Directive() // Indicates this is a base class for Angular constructs
export class BaseComponent implements OnInit, OnDestroy {
  //protected tokenSubject = new BehaviorSubject<TokenData | null>(null) // BehaviorSubject acts as a cache for the most recent data.
  unsubscribeToken$ = new Subject<void>()
  protected tokenData: TokenData | null = null

  constructor(
    protected store: Store,
  ) {
    this.store
      .select(selectTokenData)
      .pipe(takeUntil(this.unsubscribeToken$))
      .subscribe((tokenData) => {
        this.tokenData = tokenData // Store the token data locally

        //this.tokenSubject.next(tokenData) // Update BehaviorSubject with the latest token data
      })

  
  }
  ngOnInit(): void {
    // Subscribe to the BehaviorSubject to get token data
    // this.tokenSubject
    //   .pipe(takeUntil(this.unsubscribeToken$))
    //   .subscribe((tokenData) => {
    //     if (tokenData) {
    //       this.tokenData = tokenData // Store the token data locally
    //     }
    //   })
  }

  ngOnDestroy(): void {
    this.unsubscribeToken$.next()
    this.unsubscribeToken$.complete()
  }
  checkPermission(permission: string): boolean {
    if (this.tokenData?.permissions.split(',').find((x) => x === permission))
      return true

    return false
  }
}
