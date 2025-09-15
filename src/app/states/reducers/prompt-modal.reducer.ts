// prompt-modal.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { modalConfirmAction } from '../actions/modal.actions';

export interface PromptModalState {
  confirmCommand: string | null;
}

export const initialPromptModalState: PromptModalState = {
  confirmCommand: null,
};

export const promptModalReducer = createReducer(
  initialPromptModalState,
  on(modalConfirmAction, (state, { confirmCommand }) => ({
    ...state,
    confirmCommand,
  }))
);