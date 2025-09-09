import { createAction, props } from '@ngrx/store';
import { TokenData } from '../../models/token_data';

export const loadToken = createAction(
  '[LoginToken] load login token ',
  props<{ loading: boolean }>()
);

export const loadTokenSuccess = createAction(
  '[LoginToken] load login token success',
  props<{ tokenData: TokenData }>()
);
