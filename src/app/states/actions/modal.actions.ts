import { createAction, props } from '@ngrx/store';

export const setShowModalAction = createAction(
  '[Modal] Set Show Modal',
  props<{ showModalName: string; data: any | null }>()
);

export const modalConfirmAction = createAction(
  '[Modal] Confirm',
  props<{ confirmCommand: string }>()
);

export const modalConfirmWithDataAction = createAction(
  '[Modal] Confirm With Data',
  props<{ confirmCommand: string; data: any }>()
);

