import { createReducer, on } from '@ngrx/store';
import { setShowModalAction } from '../actions/modal.actions';

export interface ModalState {
  showModal: string | null;
  data: any | null;
}

export const initialModalState: ModalState = {
  showModal: null,
  data: null,
};

export const modalReducer = createReducer(
  initialModalState,
  on(setShowModalAction, (state, { showModalName, data }) => ({
    ...state,
    showModal: showModalName,
    data,
  }))
);