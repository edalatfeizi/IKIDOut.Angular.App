import { createAction, props } from '@ngrx/store'
import { BaseApiResponse } from '../../models/api/base_response'
import { ProductSendOutFlow } from '../../models/api/response/flows/product_send_out_flow'

export const loadProductSendOutFlows = createAction(
  '[ProductSendOutFlows] load products send out flows'
)

export const loadProductSendOutFlowsSuccess = createAction(
  '[ProductSendOutFlows] load products send out flows success',
  props<{ flowsRes: BaseApiResponse<ProductSendOutFlow[]> }>()
)

export const loadProductSendOutFlowsFailure = createAction(
  '[ProductSendOutFlows] load products send out flows failed',
  props<{ error: any }>()
)

export const createNewFlow = createAction(
  '[ProductSendOutFlows] create new flow',
  props<{isNewFlowCreated: boolean}>()
)
