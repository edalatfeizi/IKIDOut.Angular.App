import { ElementRef } from "@angular/core";
import { ToastTypes } from "../enums/toast_types";
import { ToastModel } from "../models/toast_model";

export class BaseModal {
    btnCloseModalId = "";
  
  constructor(
    // protected eventService: EventService,
    protected elementRef: ElementRef<HTMLElement>
  ) {
    this.btnCloseModalId = this.getRandomId(1, 1000);
  }

  confirm() {
    document.getElementById(this.btnCloseModalId)?.click();
  }

  showLoading(isLoading: boolean) {
    const progressBar = this.elementRef.nativeElement.querySelector('#progressBar');
    if (progressBar) {
      if (isLoading) {
        progressBar.classList.add('show');
        progressBar.classList.remove('gone');
      } else {
        progressBar.classList.add('gone');
        progressBar.classList.remove('show');
      }
    }
  }

  // showToast(toastType: ToastTypes, message: string) {
  //   const toastModel: ToastModel = {
  //     toastType: toastType,
  //     msg: message,
  //   };
  //   this.eventService.showToast(toastModel);
  // }

  protected getRandomId(min: number, max: number): string {
    const id = Math.floor(Math.random() * (max - min + 1)) + min;
    return "btnCloseModal_" + id;
  }
}