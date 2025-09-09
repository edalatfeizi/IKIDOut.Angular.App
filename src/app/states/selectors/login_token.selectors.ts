import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoginTokenState } from '../reducers/user_token.reducer';

// Select the feature state
export const selectLoginTokenState = createFeatureSelector<LoginTokenState>('loginToken');


export const selectTokenLoading = createSelector(
  selectLoginTokenState,
  (state: LoginTokenState) => state.loadingToken
);

export const selectTokenData = createSelector(
  selectLoginTokenState,
  (state: LoginTokenState) => state.token
);