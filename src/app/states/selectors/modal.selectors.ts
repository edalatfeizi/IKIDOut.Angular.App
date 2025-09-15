// modal.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ModalState } from './states/modal-states.state';

export const selectModalState = createFeatureSelector<ModalState>('showModal');
export const selectModalName = createSelector(selectModalState, s => s.showModal);
export const selectModalData = createSelector(selectModalState, s => s.data);