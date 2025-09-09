import { createReducer, on } from '@ngrx/store';
import * as ToastActions from '../actions/toast.actions';
import { ToastTypes } from '../../enums/toast_types';

export interface ToastState {
  toastType: ToastTypes;
  message: string | null;
}

export const initialState: ToastState = {
  toastType: ToastTypes.INFO,
  message: null,
};

export const toastReducer = createReducer(
  initialState,

  on(ToastActions.showToast, (state, { toastModel }) => ({
    ...state,
    toastType: toastModel.toastType,
    message: toastModel.message,
  })),

  on(ToastActions.clearToastMessage, (state) => ({
    ...state,
    message: null,
    toastType: ToastTypes.INFO, // optional but recommended
  }))
);
