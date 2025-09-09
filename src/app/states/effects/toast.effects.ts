// auth.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ToastActions from '../actions/toast.actions';
import { delay, map, switchMap, timer } from 'rxjs';

@Injectable()
export class ToastEffects {
  private actions$ = inject(Actions);

  // Each new toast resets the 3s timer
  autoClearToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ToastActions.showToast),
      switchMap(() =>
        timer(3000).pipe(map(() => ToastActions.clearToastMessage()))
      )
    )
  );
}