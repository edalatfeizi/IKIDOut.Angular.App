import { AfterViewInit, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Home } from './components/home/home';
import { StorageService } from './services/storage.service';
import { ToastService } from './services/toast.service';
import { Store } from '@ngrx/store';
import {
  selectIsToastVisible,
  selectToastMessage,
  selectToastType,
} from './states/selectors/toast.selectors';
import { interval, Observable, Subject, Subscription, take, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ToastModel } from './models/toast_model';
import { ToastState } from './states/reducers/toast.reducer';
import { ToastTypes } from './enums/toast_types';
import { clearToastMessage, showToast } from './states/actions/toast.actions';
import { PromptComponent } from './components/common/modals/prompt/prompt.component';
import { PromptData } from './models/prompt_data';
import {
  DELETE_PROCESS_COMMAND,
  DELETE_PROCESS_STEP_COMMAND,
  LOGOUT_COMMAND,
  RESTORE_PROCESS_COMMAND,
  SELECT_CONFIRMER_PERSON_COMMAND,
  SHOW_FLOWCHART_COMMAND,
} from './constants/prompt_commands';
import { ModalState } from './states/selectors/states/modal-states.state';
import { selectModalState } from './states/selectors/modal.selectors';
import { SelectConfirmer } from "./components/common/modals/prompt/select-confirmer/select-confirmer";
import { Actions, ofType } from '@ngrx/effects';
import { modalConfirmWithDataAction } from './states/actions/modal.actions';
import { FlowchartResDto } from './models/api/response/flowchart/flowchart_res_dto';
import { FlowchartModal } from "./components/common/modals/flowchart/flowchart";
import mermaid from 'mermaid';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar, Footer, AsyncPipe, PromptComponent, SelectConfirmer, FlowchartModal],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy , AfterViewInit{
  promptData: PromptData | null = null;
  showModal$: Observable<ModalState>;

  protected readonly title = signal('IKIDOut.Angular.App');
  storageService = inject(StorageService);

  unsubscribeAuthState$ = new Subject<void>();
  toastModel: ToastState | null = null;
  private store = inject(Store);
  private destroy$ = new Subject<void>();
  countdownSubscription: Subscription | null = null; // Track countdown subscription

  // expose enums for template comparisons
  toastTypes = ToastTypes;

  // single source of truth via async pipes
  toastMessage$: Observable<string | null> = this.store.select(selectToastMessage);
  toastType$: Observable<ToastTypes> = this.store.select(selectToastType);
  isVisible$: Observable<boolean> = this.store.select(selectIsToastVisible);
  deleteNodePrompModal = DELETE_PROCESS_STEP_COMMAND
  selectConfirmerPrompModal = SELECT_CONFIRMER_PERSON_COMMAND

  constructor(private actions$: Actions) {
    // this.store
    //   .select(selectShowToast)
    //   .pipe(takeUntil(this.unsubscribeAuthState$))
    //   .subscribe((toast) => {
    //     if (toast) {
    //       this.toastModel = toast;
    //     }
    //   });
    this.showModal$ = this.store.select(selectModalState); // or 'showModal' string key

    this.showModal$.subscribe((modalState) => {
      // modalState is now an object with {showModal, data} from initial state onwards
      switch ((modalState.data as PromptData).promptCommand) {
        case LOGOUT_COMMAND:
        case DELETE_PROCESS_STEP_COMMAND:
        case DELETE_PROCESS_COMMAND:
        case RESTORE_PROCESS_COMMAND:
        case SELECT_CONFIRMER_PERSON_COMMAND:
          this.promptData = modalState.data as PromptData;
          break;

        default:
          this.promptData = null;
      }

    });
  }
  ngAfterViewInit(): void {
    mermaid.initialize({ startOnLoad: true, theme: 'default' });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    // this.loginMessage$.pipe(takeUntil(this.destroy$)).subscribe((message) => {
    //   if (message) this.toastMessage = message;
    // });
  }

  // optional manual dismiss (clicking the ×)
  dismissToast() {
    this.store.dispatch(clearToastMessage());
  }

  // example trigger
  triggerErrorToast() {
    this.store.dispatch(
      showToast({ toastModel: { toastType: ToastTypes.DANGER, message: 'Login failed' } })
    );
  }
  checkUserAuthorized() {
    return this.storageService.isConfirmed() && this.storageService.isPassChanged();
  }
}
