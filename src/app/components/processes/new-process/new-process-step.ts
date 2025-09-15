import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppProcessesService } from '../../../services/processes.service';
import { Store } from '@ngrx/store';
import { ToastTypes } from '../../../enums/toast_types';
import { showToast } from '../../../states/actions/toast.actions';
import {
  DELETE_PROCESS_STEP,
  ERR_ENTER_NEW_PROCESS_DESC,
  ERR_ENTER_NEW_PROCESS_NAME,
  ERR_ENTER_NEW_PROCESS_STEP_DESC,
  ERR_ENTER_NEW_PROCESS_STEP_NAME,
  ERR_INTERNAL_SERVER,
  LOGOUT,
  MSG_ADD_NEW_PROCESS_STEP_SUCCESS,
  MSG_ARE_YOU_SURE,
  MSG_DELETE_PROCESS_STEP_SUCCESS,
  MSG_DELETE_PROMPT,
  MSG_LOGOUT_CONFIRM,
  MSG_UPDATE_PROCESS_STEP_SUCCESS,
  MSG_UPDATE_PROCESS_SUCCESS,
  PROCESS_STEP,
} from '../../../constants/Messages';
import { AppProcessResDto } from '../../../models/api/response/process/app-process-res-dto';
import { NewProcessStepDto } from '../../../models/api/request/process/new-process-step-dto';
import { BehaviorSubject } from 'rxjs';
import { ProcessStepResDto } from '../../../models/api/response/process/process-step-res-dto';
import { CommonModule } from '@angular/common';
import { AddProcessDto } from '../../../models/api/request/process/add-process-dto';
import { UpdateProcessDto } from '../../../models/api/request/process/update-process-dto';
import { FormsModule } from '@angular/forms';
import { UpdateProcessStepDto } from '../../../models/api/request/process/update-process-step-dto';
import { PromptData } from '../../../models/prompt_data';
import {
  CONFIRM_DELETE_PROCESS_STEP_COMMAND,
  CONFIRM_LOGOUT_COMMAND,
  DELETE_PROCESS_STEP_COMMAND,
  LOGOUT_COMMAND,
} from '../../../constants/prompt_commands';
import { modalConfirmAction, setShowModalAction } from '../../../states/actions/modal.actions';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-new-process',
  imports: [CommonModule, FormsModule],
  templateUrl: './new-process-step.html',
  styleUrl: './new-process-step.css',
})
export class NewProcessStep implements OnInit {
  isLoading = false;
  // isNewProcess = false
  process: AppProcessResDto | null = null;
  processSteps$ = new BehaviorSubject<ProcessStepResDto[]>([]);
  selectedProcessStep: ProcessStepResDto | null = null;
  errorMessage = '';
  @ViewChild('btnCloseModal') btnCloseModal!: ElementRef<HTMLButtonElement>;

  constructor(
    private processService: AppProcessesService,
    private store: Store,
    private actions$: Actions
  ) {
    this.actions$.pipe(ofType(modalConfirmAction)).subscribe((action) => {
      switch (action.confirmCommand) {
        case CONFIRM_DELETE_PROCESS_STEP_COMMAND:
          this.deleteProcessStep();
          break;
      }
    });
  }
  ngOnInit(): void {
    this.process = history.state.process;
    if (this.process!.steps.length > 0) this.setProccessStepsData(this.process?.steps!);
    // else
    // this.isNewProcess = true
  }
  validateNewStep(name: string, description: string, isNewStep: boolean) {
    if (name === '') {
      this.showMessage(ERR_ENTER_NEW_PROCESS_STEP_NAME, ToastTypes.DANGER);
    } else if (description === '') {
      this.showMessage(ERR_ENTER_NEW_PROCESS_STEP_DESC, ToastTypes.DANGER);
    } else {
      if (isNewStep) {
        var newProcessStep: NewProcessStepDto = {
          Name: name,
          Description: description,
          RoleRequired: '',
        };
        this.addProcessStep(newProcessStep);
      } else {
        var updatedStep: UpdateProcessStepDto = {
          Name: name,
          Description: description,
          RoleRequired: '',
          ProcessStepTypeId: 0,
          Order: 0,
        };
        this.updateProcessStep(this.process!.id, this.selectedProcessStep!.id, updatedStep);
      }
    }
  }

  showMessage(message: string, toastType: ToastTypes) {
    this.store.dispatch(showToast({ toastModel: { toastType: toastType, message: message } }));
  }

  addProcessStep(newProcessStep: NewProcessStepDto) {
    this.isLoading = true;
    this.processService.addProcessStep(this.process!.id, newProcessStep).subscribe({
      next: (data) => {
        if (data.succeed) {
          this.setProccessStepsData([data.data]);

          this.showMessage(MSG_ADD_NEW_PROCESS_STEP_SUCCESS, ToastTypes.SUCCESS);
          // this.router.navigate(['processes/new'], {
          //   state: { newProcess: data.data },
          //   replaceUrl: true,
          // });
          this.process?.steps;
        } else {
          // this.errorMessage = data.message;
          this.showMessage(data.message, ToastTypes.DANGER);

          // this.eventService.showServerError(data)
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        //this.errorMessage = ERR_INTERNAL_SERVER;

        this.showMessage(ERR_INTERNAL_SERVER, ToastTypes.DANGER);
      },
    });
  }
  deleteProcessStep() {
    this.isLoading = true;
    this.processService
      .deleteProcessStep(this.process!.id, this.selectedProcessStep!.id)
      .subscribe({
        next: (data) => {
          if (data.succeed) {
            const current = this.processSteps$.getValue();
            const updated = current.filter((step) => step.id !== this.selectedProcessStep!.id);
            this.processSteps$.next(updated);
            this.showMessage(MSG_DELETE_PROCESS_STEP_SUCCESS, ToastTypes.SUCCESS);
          } else {
            // this.errorMessage = data.message;
            this.showMessage(data.message, ToastTypes.DANGER);

            // this.eventService.showServerError(data)
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          //this.errorMessage = ERR_INTERNAL_SERVER;

          this.showMessage(ERR_INTERNAL_SERVER, ToastTypes.DANGER);
        },
      });
  }
  validateProcess(name: string, description: string) {
    if (name === '') {
      this.showMessage(ERR_ENTER_NEW_PROCESS_NAME, ToastTypes.DANGER);
      // this.errorMessage = ERR_ENTER_NEW_PROCESS_NAME;
    } else if (description === '') {
      this.showMessage(ERR_ENTER_NEW_PROCESS_DESC, ToastTypes.DANGER);
      // this.errorMessage = ERR_ENTER_NEW_PROCESS_DESC;
    } else {
      var newProcess: UpdateProcessDto = {
        Name: name,
        Description: description,
      };
      this.updateProcess(this.process!.id, newProcess);
    }
  }
  updateProcess(processId: number, process: UpdateProcessDto) {
    this.isLoading = true;
    this.processService.updateProcess(processId, process).subscribe({
      next: (data) => {
        if (data.succeed) {
          this.btnCloseModal.nativeElement?.click();
          this.showMessage(MSG_UPDATE_PROCESS_SUCCESS, ToastTypes.SUCCESS);
          //this.showProcess(data.data)
        } else {
          this.errorMessage = data.message;
          //this.showMessage(data.message, ToastTypes.DANGER);

          // this.eventService.showServerError(data)
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = ERR_INTERNAL_SERVER;

        //this.showMessage(ERR_INTERNAL_SERVER, ToastTypes.DANGER);
      },
    });
  }
  updateProcessStep(processId: number, stepId: number, step: UpdateProcessStepDto) {
    this.isLoading = true;
    this.processService.updateProcessStep(processId, stepId, step).subscribe({
      next: (data) => {
        this.isLoading = false;

        if (!data.succeed) {
          this.errorMessage = data.message;
          return;
        }

        // assuming data.data is the updated ProcessStepResDto
        const updatedStep: ProcessStepResDto = data.data;

        // update BehaviorSubject immutably
        const current = this.processSteps$.getValue();
        const updatedList = current.map((s) =>
          s.id === updatedStep.id ? { ...s, ...updatedStep } : s
        );
        this.processSteps$.next(updatedList);

        this.btnCloseModal.nativeElement?.click();
        this.showMessage(MSG_UPDATE_PROCESS_STEP_SUCCESS, ToastTypes.SUCCESS);
      },
      error: (err) => {
        this.isLoading = false;
        // this.errorMessage = ERR_INTERNAL_SERVER;

        this.showMessage(ERR_INTERNAL_SERVER, ToastTypes.DANGER);
      },
    });
  }
  private setProccessStepsData(data: ProcessStepResDto[]) {
    const newProcessStep = data.map((newStep: ProcessStepResDto) => ({
      ...newStep,
      isSelected: false,
    }));

    const currentProcessSteps = this.processSteps$.getValue();
    const updatedProcessSteps = [...currentProcessSteps, ...newProcessStep];
    this.processSteps$.next(updatedProcessSteps);
  }
  trackByProcessStepId(index: number, processStep: ProcessStepResDto): number {
    return processStep.id; // Assuming 'id' is a unique identifier for each document
  }
  setSelectedStep(processStep: ProcessStepResDto) {
    this.selectedProcessStep = processStep;
  }

  showDeleteProcessStepPrompt(step: ProcessStepResDto) {
    this.setSelectedStep(step);
    var promptData: PromptData = {
      title: DELETE_PROCESS_STEP,
      description: `${MSG_DELETE_PROMPT} ${PROCESS_STEP} ${step.name} ${MSG_ARE_YOU_SURE}`,
      promptCommand: DELETE_PROCESS_STEP_COMMAND,
    };
    this.store.dispatch(setShowModalAction({ showModalName: 'Prompt', data: promptData }));
  }

  
}
