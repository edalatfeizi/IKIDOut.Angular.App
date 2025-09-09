import { ToastTypes } from '../enums/toast_types';

export interface ToastModel {
  toastType: ToastTypes;
  message: string;
}
