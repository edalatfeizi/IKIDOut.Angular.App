
import * as ProductSendOutFlowsActions from '../actions/product_send_out_flows.actions'
import { catchError, map, of, switchMap } from 'rxjs'
import { inject, Injectable } from '@angular/core'
import { BaseApiResponse } from '../../models/api/base_response'
import { ProductSendOutFlow } from '../../models/api/response/flows/product_send_out_flow'
import { ManageSendOutFlowsService } from '../../services/manage-send-out-flows.service'
import { Actions, createEffect, ofType } from '@ngrx/effects'
@Injectable()
export class ProductSendOutFlowsEffects {
  // constructor(private actions$: Actions, private manageSendOutFlowsService: ManageSendOutFlowsService){}
  private actions$ = inject(Actions) // Alternative to constructor injection
  private manageSendOutFlowsService = inject(ManageSendOutFlowsService)
  flows$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductSendOutFlowsActions.loadProductSendOutFlows),
      switchMap(() =>
        this.manageSendOutFlowsService.getAllFlows().pipe(
          map((flowsRes: BaseApiResponse<ProductSendOutFlow[]>) =>
            ProductSendOutFlowsActions.loadProductSendOutFlowsSuccess({
              flowsRes,
            })
          ),
          catchError((error) =>
            of(
              ProductSendOutFlowsActions.loadProductSendOutFlowsFailure({
                error,
              })
            )
          )
        )
      )
    )
  )
}
