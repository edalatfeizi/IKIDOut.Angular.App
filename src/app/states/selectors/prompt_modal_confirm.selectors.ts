import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PromptModalState } from '../reducers/prompt-modal.reducer';

export const selectPromptModalState =
  createFeatureSelector<PromptModalState>('promptModal');

export const selectConfirmCommand = createSelector(
  selectPromptModalState,
  (state) => state.confirmCommand
);