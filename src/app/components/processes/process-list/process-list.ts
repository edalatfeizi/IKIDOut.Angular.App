import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppProcessesService } from '../../../services/processes.service';
import { ToastTypes } from '../../../enums/toast_types';
import { Store } from '@ngrx/store';
import { showToast } from '../../../states/actions/toast.actions';
import {
  DELETE_PROCESS,
  DELETE_PROCESS_STEP,
  ERR_CANNOT_CONNECT_SERVER,
  ERR_ENTER_NEW_PROCESS_DESC,
  ERR_ENTER_NEW_PROCESS_NAME,
  ERR_INTERNAL_SERVER,
  MSG_ADD_NEW_PROCESS_SUCCESS,
  MSG_ARE_YOU_SURE,
  MSG_DELETE_PROCESS_STEP_SUCCESS,
  MSG_DELETE_PROCESS_SUCCESS,
  MSG_DELETE_PROMPT,
  MSG_RESTORE_PROCESS_SUCCESS,
  MSG_RESTORE_PROMPT,
  PROCESS,
  RESTORE_PROCESS,
} from '../../../constants/Messages';
import { BehaviorSubject, forkJoin, map } from 'rxjs';
import { AppProcessResDto } from '../../../models/api/response/process/app-process-res-dto';
import { CommonModule } from '@angular/common';
import { AddProcessDto } from '../../../models/api/request/process/add-process-dto';
import { PromptData } from '../../../models/prompt_data';
import {
  CONFIRM_DELETE_PROCESS_COMMAND,
  CONFIRM_RESTORE_PROCESS_COMMAND,
  DELETE_PROCESS_COMMAND,
  DELETE_PROCESS_STEP_COMMAND,
  RESTORE_PROCESS_COMMAND,
} from '../../../constants/prompt_commands';
import { modalConfirmAction, setShowModalAction } from '../../../states/actions/modal.actions';
import { Actions, ofType } from '@ngrx/effects';
import { FlowchartResDto } from '../../../models/api/response/flowchart/flowchart_res_dto';
import { FlowChartService } from '../../../services/flowchart.service';
import { AddFlowchartDto } from '../../../models/api/request/flowchart/add_flowchart_dto';

@Component({
  selector: 'app-process-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './process-list.html',
  styleUrl: './process-list.css',
})
export class ProcessList implements OnInit {
  isLoading = false;
  flowcharts$ = new BehaviorSubject<FlowchartResDto[]>([]);
  showingFlowcharts$ = new BehaviorSubject<FlowchartResDto[]>([]);
  selectedFlowchart: FlowchartResDto | null = null;
  errorMessage = '';
  @ViewChild('btnCloseModal') btnCloseModal!: ElementRef<HTMLButtonElement>;

  constructor(
    private flowchartsService: FlowChartService,
    private store: Store,
    private router: Router,
    private actions$: Actions
  ) {
    this.actions$.pipe(ofType(modalConfirmAction)).subscribe((action) => {
      switch (action.confirmCommand) {
        case CONFIRM_DELETE_PROCESS_COMMAND:
          this.deleteProcess();
          break;

        case CONFIRM_RESTORE_PROCESS_COMMAND:
          this.restoreProcess();
          break;
      }
    });
  }
  ngOnInit(): void {
    this.getAppProccesses();
  }

  getAppProccesses() {
    this.isLoading = true;
    this.flowchartsService.getAppFlowcharts().subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data.succeed) {
          this.setProccessesData(data.data);
          if (data.totalCount === 0)
            // this.store.dispatch(
            //   shareProfileAction({personNationalCode: this.EmpNationalCode, isProfileShared: false })
            // )
            console.log('No Processes');
        } else {
          this.showMessage(data.message, ToastTypes.DANGER);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.showMessage(ERR_CANNOT_CONNECT_SERVER, ToastTypes.SUCCESS);
      },
    });
  }
  // getFlowchartMermaid(id: number) {
  //   this.isLoading = true;
  //   this.flowchartsService.getFlowchartMermaid(id).subscribe({
  //     next: (data) => {
  //       this.isLoading = false;
  //       if (data.succeed) {
  //         var d = data.data.flowchart.replace(/\r\n/g, '\n')   // normalize Windows newlines
  //         .replace(/\r/g, '\n');
          
          
  //       } else {
  //         this.showMessage(data.message, ToastTypes.DANGER);
  //       }
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       this.showMessage(ERR_CANNOT_CONNECT_SERVER, ToastTypes.SUCCESS);
  //     },
  //   });
  // }
  private setProccessesData(data: FlowchartResDto[]) {
    const newProcesses = data.map((doc: FlowchartResDto) => ({
      ...doc,
      isSelected: false,
    }));

  // Create an array of observables for each process
  const requests = newProcesses.map(proc =>
    this.flowchartsService.getFlowchartMermaid(proc.id).pipe(
      map(res => {
        if (res.succeed) {
          // normalize line breaks
          proc.flowcharDef = res.data.flowchart
            // .replace(/\r\n/g, '\n')
            // .replace(/\r/g, '\n');
        } else {
          this.showMessage(res.message, ToastTypes.DANGER);
        }
        return proc;
      })
    )
  );
  // Run all requests in parallel
  forkJoin(requests).subscribe({
    next: (processesWithFlowcharts) => {
      const currentProcesses = this.flowcharts$.getValue();
      const updatedProcesses = [...currentProcesses, ...processesWithFlowcharts];

      this.flowcharts$.next(updatedProcesses);
      this.filterProcesses(undefined);
    },
    error: () => {
      this.showMessage(ERR_CANNOT_CONNECT_SERVER, ToastTypes.DANGER);
    }
  });
    // const currentProcesses = this.flowcharts$.getValue();
    // const updatedProcesses = [...currentProcesses, ...newProcesses];

    // this.flowcharts$.next(updatedProcesses);
    // this.filterProcesses(undefined)
  }
  filterProcesses(active: boolean | undefined) {
    if (active == undefined) {
      this.showingFlowcharts$.next(this.flowcharts$.getValue());
    } else {
      this.showingFlowcharts$.next([]);
      const current = this.flowcharts$.getValue(); // get the current value
      const filtered = current.filter((proc) => proc.active === active);
      this.showingFlowcharts$.next(filtered);
    }
  }
  trackByFlowchartId(index: number, flowchart: FlowchartResDto): number {
    return flowchart.id; // Assuming 'id' is a unique identifier for each document
  }
  showMessage(message: string, toastType: ToastTypes) {
    this.store.dispatch(showToast({ toastModel: { toastType: toastType, message: message } }));
  }
  validateNewProcess(name: string, description: string) {
    if (name === '') {
      // this.showMessage(ERR_ENTER_NEW_PROCESS_NAME,ToastTypes.DANGER);
      this.errorMessage = ERR_ENTER_NEW_PROCESS_NAME;
    } else if (description === '') {
      // this.showMessage( ERR_ENTER_NEW_PROCESS_DESC,ToastTypes.DANGER)
      this.errorMessage = ERR_ENTER_NEW_PROCESS_DESC;
    } else {
      var flowchart: AddFlowchartDto = {
        Name: name,
        Description: description,
      };
      this.addFlowchart(flowchart);
    }
  }
  addFlowchart(flowchart: AddFlowchartDto) {
    this.isLoading = true;
    this.flowchartsService.addFlowchart(flowchart).subscribe({
      next: (data) => {
        if (data.succeed) {
          this.btnCloseModal.nativeElement?.click();
          this.showMessage(MSG_ADD_NEW_PROCESS_SUCCESS, ToastTypes.SUCCESS);
          this.showFlowchart(data.data);
        } else {
          this.errorMessage = data.message;
          // this.showMessage(data.message, ToastTypes.DANGER);

          // this.eventService.showServerError(data)
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = ERR_INTERNAL_SERVER;

        // this.showMessage(ERR_INTERNAL_SERVER, ToastTypes.DANGER);
      },
    });
  }
  deleteProcess() {
    this.isLoading = true;
    this.flowchartsService.deleteFlowchart(this.selectedFlowchart!.id).subscribe({
      next: (data) => {
        if (data.succeed) {
          const processes = this.flowcharts$.getValue();

          const updated = processes.map((p) =>
            p.id === this.selectedFlowchart!.id ? { ...p, active: false } : p
          );

          this.flowcharts$.next(updated);
          this.showMessage(MSG_DELETE_PROCESS_SUCCESS, ToastTypes.SUCCESS);
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

  restoreProcess() {
    // this.isLoading = true;
    // this.appProcessesService.restoreProcess(this.selectedFlowchart!.id).subscribe({
    //   next: (data) => {
    //     if (data.succeed) {
    //       const processes = this.flowcharts$.getValue();

    //       const updated = processes.map((p) =>
    //         p.id === this.selectedFlowchart!.id ? { ...p, active: true } : p
    //       );

    //       this.flowcharts$.next(updated);
    //       this.showMessage(MSG_RESTORE_PROCESS_SUCCESS, ToastTypes.SUCCESS);
    //     } else {
    //       // this.errorMessage = data.message;
    //       this.showMessage(data.message, ToastTypes.DANGER);

    //       // this.eventService.showServerError(data)
    //     }
    //     this.isLoading = false;
    //   },
    //   error: (err) => {
    //     this.isLoading = false;
    //     //this.errorMessage = ERR_INTERNAL_SERVER;

    //     this.showMessage(ERR_INTERNAL_SERVER, ToastTypes.DANGER);
    //   },
    // });
  }
  showFlowchart(flowchart: FlowchartResDto) {
    this.router.navigate(['processes/new'], {
      state: { flowchart: flowchart },
      replaceUrl: true,
    });
  }

  showDeleteProcessPrompt(flowchart: FlowchartResDto) {
    this.selectedFlowchart = flowchart;
    var promptData: PromptData = {
      title: DELETE_PROCESS,
      description: `${MSG_DELETE_PROMPT} ${PROCESS} ${flowchart.name} ${MSG_ARE_YOU_SURE}`,
      promptCommand: DELETE_PROCESS_COMMAND,
    };
    this.store.dispatch(setShowModalAction({ showModalName: 'Prompt', data: promptData }));
  }
  showActivateProcessPrompt(flowchart: FlowchartResDto) {
    this.selectedFlowchart = flowchart;
    var promptData: PromptData = {
      title: RESTORE_PROCESS,
      description: `${MSG_RESTORE_PROMPT} ${PROCESS} ${flowchart.name} ${MSG_ARE_YOU_SURE}`,
      promptCommand: RESTORE_PROCESS_COMMAND,
    };
    this.store.dispatch(setShowModalAction({ showModalName: 'Prompt', data: promptData }));
  }
}
