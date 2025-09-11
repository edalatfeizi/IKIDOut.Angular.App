import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppProcessesService } from '../../../services/processes.service';
import { ToastTypes } from '../../../enums/toast_types';
import { Store } from '@ngrx/store';
import { showToast } from '../../../states/actions/toast.actions';
import { ERR_CANNOT_CONNECT_SERVER } from '../../../constants/Messages';
import { BehaviorSubject } from 'rxjs';
import { AppProcessResDto } from '../../../models/api/response/process/app-process';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-process-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './process-list.html',
  styleUrl: './process-list.css',
})
export class ProcessList implements OnInit {
  isLoading = false;
  processes$ = new BehaviorSubject<AppProcessResDto[]>([]);

  constructor(private appProcessesService: AppProcessesService, private store: Store) {}
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
          this.showToast(data.message, ToastTypes.DANGER);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.showToast(ERR_CANNOT_CONNECT_SERVER, ToastTypes.SUCCESS);
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
  showToast(message: string, toastType: ToastTypes) {
    this.store.dispatch(showToast({ toastModel: { toastType: toastType, message: message } }));
  }
}
