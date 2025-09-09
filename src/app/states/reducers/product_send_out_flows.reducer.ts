import { createReducer, on } from '@ngrx/store'
import * as ProductSendOutFlowsActions from '../actions/product_send_out_flows.actions'
import { BaseApiResponse } from '../../models/api/base_response'
import { ProductSendOutFlow } from '../../models/api/response/flows/product_send_out_flow'

export interface ProductSendOutFlowsState {
  flows: BaseApiResponse<ProductSendOutFlow[]> | null
  loading: boolean
  error: any
}

export const initialState: ProductSendOutFlowsState = {
  flows: null,
  loading: false,
  error: null,
}

export interface NewProductSendOutFlowState {
  isNewProductSendOutFlowCreated: boolean
}

export const initialNewProductSendOutFlowState: NewProductSendOutFlowState = {
  isNewProductSendOutFlowCreated: false,
}

export const productSendOutFlowsReducer = createReducer(
  initialState,
  on(ProductSendOutFlowsActions.loadProductSendOutFlows, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    ProductSendOutFlowsActions.loadProductSendOutFlowsSuccess,
    (state, { flowsRes }) => ({
      ...state,
      loading: false,
      flowsRes: flowsRes,
    })
  ),
  on(
    ProductSendOutFlowsActions.loadProductSendOutFlowsFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })
  )
)

export const createNewFlowReducer = createReducer(
  initialNewProductSendOutFlowState,
  on(
    ProductSendOutFlowsActions.createNewFlow,
    (state, { isNewFlowCreated }) => ({
      ...state,
      isNewProductSendOutFlowCreated: isNewFlowCreated,
    })
  )
)
