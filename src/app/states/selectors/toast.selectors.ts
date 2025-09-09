import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ToastState } from '../reducers/toast.reducer';

// Select the feature state
export const selectToastState = createFeatureSelector<ToastState>('toastState');

export const selectToastMessage = createSelector(
  selectToastState,
  (s) => s.message
);

export const selectToastType = createSelector(
  selectToastState,
  (s) => s.toastType
);

export const selectIsToastVisible = createSelector(
  selectToastMessage,
  (message) => !!message
);