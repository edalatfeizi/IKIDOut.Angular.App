import { createAction, props } from '@ngrx/store';
import { ToastModel } from '../../models/toast_state';

export const showToast = createAction('[Toasts] Show Toast', props<{ toastModel: ToastModel }>());
export const clearToastMessage = createAction('[Toasts] Clear Toast');
