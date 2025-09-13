import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppProcessesService } from '../../../services/processes.service';
import { ToastTypes } from '../../../enums/toast_types';
import { Store } from '@ngrx/store';
import { showToast } from '../../../states/actions/toast.actions';
import {
  ERR_CANNOT_CONNECT_SERVER,
  ERR_ENTER_NEW_PROCESS_DESC,
  ERR_ENTER_NEW_PROCESS_NAME,
  ERR_INTERNAL_SERVER,
  MSG_ADD_NEW_PROCESS_SUCCESS,
} from '../../../constants/Messages';
import { BehaviorSubject } from 'rxjs';
import { AppProcessResDto } from '../../../models/api/response/process/app-process-res-dto';
import { CommonModule } from '@angular/common';
import { AddProcessDto } from '../../../models/api/request/process/add-process-dto';

@Component({
  selector: 'app-process-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './process-list.html',
  styleUrl: './process-list.css',
})
export class ProcessList implements OnInit {
  isLoading = false;
  processes$ = new BehaviorSubject<AppProcessResDto[]>([]);
  errorMessage = '';
  @ViewChild('btnCloseModal') btnCloseModal!: ElementRef<HTMLButtonElement>;

  constructor(
    private appProcessesService: AppProcessesService,
    private store: Store,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getAppProccesses();
  }

  getAppProccesses() {
    this.isLoading = true;
    this.appProcessesService.getAppProcesses().subscribe({
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

  private setProccessesData(data: AppProcessResDto[]) {
    const newProcesses = data.map((doc: AppProcessResDto) => ({
      ...doc,
      isSelected: false,
    }));

    const currentProcesses = this.processes$.getValue();
    const updatedProcesses = [...currentProcesses, ...newProcesses];
    this.processes$.next(updatedProcesses);
  }
  trackByProcessId(index: number, process: AppProcessResDto): number {
    return process.id; // Assuming 'id' is a unique identifier for each document
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
      var newProcess: AddProcessDto = {
        Name: name,
        Description: description,
      };
      this.addProcess(newProcess);
    }
  }
  addProcess(newProcess: AddProcessDto) {
    this.isLoading = true;
    this.appProcessesService.addProcess(newProcess).subscribe({
      next: (data) => {
        if (data.succeed) {
          this.btnCloseModal.nativeElement?.click();
          this.showMessage(MSG_ADD_NEW_PROCESS_SUCCESS, ToastTypes.SUCCESS);
            this.showProcess(data.data)
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
  showProcess(process: AppProcessResDto){
    this.router.navigate(['processes/new'], {
      state: { process: process },
      replaceUrl: true,
    });
  }
}
