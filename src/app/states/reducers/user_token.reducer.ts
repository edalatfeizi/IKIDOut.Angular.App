import { createReducer, on } from '@ngrx/store'
import * as LoginTokenActions from '../actions/user_token.actions'
import { TokenData } from '../../models/token_data'

export interface LoginTokenState {
  loadingToken: boolean,
  token: TokenData | null
}

export const initialState: LoginTokenState = {
  loadingToken: false,
  token: null,
}

export const loginTokenReducer = createReducer(
  initialState,

  on(LoginTokenActions.loadToken, (state, {loading}) => ({
    ...state,
    loadingToken: loading
  })),
  on(LoginTokenActions.loadTokenSuccess, (state, {tokenData}) => ({
    ...state,
    token: tokenData
  })),

)
