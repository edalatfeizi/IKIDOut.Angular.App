import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import {
  CONFIRM_DELETE_PERMISSION,
  CONFIRM_DELETE_PROCESS_COMMAND,
  CONFIRM_DELETE_PROCESS_STEP_COMMAND,
  CONFIRM_DELETE_USER_ROLE,
  CONFIRM_LOGOUT_COMMAND,
  CONFIRM_RESTORE_PROCESS_COMMAND,
  DELETE_PERMISSION_COMMAND,
  DELETE_PROCESS_COMMAND,
  DELETE_PROCESS_STEP_COMMAND,
  DELETE_USER_ROLE_COMMAND,
  LOGOUT_COMMAND,
  RESTORE_PROCESS_COMMAND,
} from '../../../../constants/prompt_commands';
import { modalConfirmAction, modalConfirmWithDataAction } from '../../../../states/actions/modal.actions';

@Component({
  selector: 'app-prompt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prompt.component.html',
  styleUrl: './prompt.component.scss',
})
export class PromptComponent implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() promptCommand: string = '';
  htmlContent: SafeHtml = '';
  constructor(private store: Store, private sanitizer: DomSanitizer) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['description'] && !changes['description'].firstChange) {
      // Update the modal content and show the modal when content changes
      this.setContent(this.description);
    }
  }
  ngOnInit(): void {
    this.setContent(this.description);
  }
  private setContent(content: string) {
    this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(content); //bypasses Angular's built-in XSS protection
  }
  confirm() {
    switch (this.promptCommand) {
      case LOGOUT_COMMAND:
        this.store.dispatch(modalConfirmAction({ confirmCommand: CONFIRM_LOGOUT_COMMAND }));
        break;
      case DELETE_PERMISSION_COMMAND:
        this.store.dispatch(modalConfirmAction({ confirmCommand: CONFIRM_DELETE_PERMISSION }));
        break;

      case DELETE_USER_ROLE_COMMAND:
        this.store.dispatch(modalConfirmAction({ confirmCommand: CONFIRM_DELETE_USER_ROLE }));
        break;
      case DELETE_PROCESS_STEP_COMMAND:
        this.store.dispatch(
          modalConfirmAction({ confirmCommand: CONFIRM_DELETE_PROCESS_STEP_COMMAND })
        );
        break;

      case DELETE_PROCESS_COMMAND:
        this.store.dispatch(modalConfirmAction({ confirmCommand: CONFIRM_DELETE_PROCESS_COMMAND }));
        break;

      case RESTORE_PROCESS_COMMAND:
        this.store.dispatch(
          modalConfirmAction({ confirmCommand: CONFIRM_RESTORE_PROCESS_COMMAND })
        );
        break;
    }
    // this.eventService.deleteImage(true)

    document.getElementById('btnClosePromptModal')?.click();

   
  }
}
