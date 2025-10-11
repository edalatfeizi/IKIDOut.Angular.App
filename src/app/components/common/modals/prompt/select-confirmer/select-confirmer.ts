import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import {  CONFIRM_SELECT_CONFIRMER_COMMAND, SELECT_CONFIRMER_PERSON_COMMAND } from '../../../../../constants/prompt_commands';
import { modalConfirmAction, modalConfirmWithDataAction } from '../../../../../states/actions/modal.actions';
import { ConfirmerUser } from '../../../../../models/confirmer_user';
import { PersonelyService } from '../../../../../services/personely.service';
import { FilterPersonel } from '../../../../../models/api/request/personely/filter_personel_dto';
import { OK } from '../../../../../constants/HttpStatusCodes';

@Component({
  selector: 'app-select-confirmer',
  imports: [],
  templateUrl: './select-confirmer.html',
  styleUrl: './select-confirmer.css'
})
export class SelectConfirmer implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() promptCommand: string = '';
  htmlContent: SafeHtml = '';
  constructor(private store: Store, private personelyService: PersonelyService, private sanitizer: DomSanitizer) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['description'] && !changes['description'].firstChange) {
      // Update the modal content and show the modal when content changes
      this.setContent(this.description);
    }
  }
  ngOnInit(): void {
    this.setContent(this.description);

    const filter: FilterPersonel = {
      searchTerm: null,
      departCode: null,
      departName: null,
      engageType: null,
      sortByEngageDate: null,
      postTypes: []
    }

    this.filterPersonel(filter)
  }
  private setContent(content: string) {
    this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(content); //bypasses Angular's built-in XSS protection
  }
  confirm() {
    switch (this.promptCommand) {
      case SELECT_CONFIRMER_PERSON_COMMAND:
        var confirmer : ConfirmerUser = {
          userId: '212',
          post: "323",
          personCode: ""
        }
        this.store.dispatch(
          modalConfirmWithDataAction({ confirmCommand: CONFIRM_SELECT_CONFIRMER_COMMAND , data: confirmer})
        );
        break;
    }
    // this.eventService.deleteImage(true)

    document.getElementById('btnCloseSelectConfirmerPromptModal')?.click();
  }

  filterPersonel(filter: FilterPersonel) {
   
    // this.personelyService.getPersons(true, 1, filter).subscribe({
    //   next: (data) => {
    //     if (!this.) this.showLoading(false)
    //     if (data.succeed) {
    //       this.person = data.data[0]
    //       if (this.isUploading === false) {
    //         this.getPersonDocs(this.personNationalId, 1)
    //         this.getClassifiedPersonDocs(this.personNationalId)
    //       }
    //       //else this.uploadDocsTab?.nativeElement.click()
    //     } else if (data.responseCode != OK) {
    //       this.eventService.showServerError(data)
    //     }
    //   },
    //   error: () => {
    //     if (!this.isUploading) this.showLoading(false)
    //   },
    // })
  }
}