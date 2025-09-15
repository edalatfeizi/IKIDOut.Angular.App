import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './interceptors/http.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideStore } from '@ngrx/store';
import { loginTokenReducer } from './states/reducers/user_token.reducer';
import { productSendOutFlowsReducer } from './states/reducers/product_send_out_flows.reducer';
import { provideEffects } from '@ngrx/effects';
import { ProductSendOutFlowsEffects } from './states/effects/product_send_out_flows.effects';
import { toastReducer } from './states/reducers/toast.reducer';
import { ToastEffects } from './states/effects/toast.effects';
import { promptModalReducer } from './states/reducers/prompt-modal.reducer';
import { modalReducer } from './states/reducers/modal.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpInterceptor, authInterceptor])),
    // provideClientHydration(), // Always include for SSR
    // provideAnimations(),
    // provideAnimationsAsync(),
    provideStore(
      {
        loginToken: loginTokenReducer,
        toastState: toastReducer,
        productSendOutFlowsReducer: productSendOutFlowsReducer,
        showModal: modalReducer,          // <— the slice App component selects
        promptModal: promptModalReducer,

      },
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
        },
      }
    ),
    provideEffects([ProductSendOutFlowsEffects, ToastEffects]),
  ],
};
