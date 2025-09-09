import { createFeatureSelector, createSelector } from '@ngrx/store'
import { NewProductSendOutFlowState, ProductSendOutFlowsState } from '../reducers/product_send_out_flows.reducer'

export const selectNewProductSendOutFlowState =
  createFeatureSelector<NewProductSendOutFlowState>(
    'createNewFlowReducer'
  )

  export const selectNewSendOutFlowStates = createSelector(
    selectNewProductSendOutFlowState,
    (state: NewProductSendOutFlowState) => state.isNewProductSendOutFlowCreated
  )

  export const selectProductSendOutFlowsState = createFeatureSelector<ProductSendOutFlowsState>('flows')

  export const selectProductSendOutFlows = createSelector(
    selectProductSendOutFlowsState,
    (state: ProductSendOutFlowsState) => state.flows
  )

  export const selectProductSendOutFlowsLoading = createSelector(
    selectProductSendOutFlowsState,
    (state: ProductSendOutFlowsState) => state.loading
  )

  export const selectProductSendOutFlowsError = createSelector(
    selectProductSendOutFlowsState,
    (state: ProductSendOutFlowsState) => state.error
  )