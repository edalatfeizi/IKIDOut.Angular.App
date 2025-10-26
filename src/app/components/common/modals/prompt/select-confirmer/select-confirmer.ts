import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import {
  CONFIRM_SELECT_CONFIRMER_COMMAND,
  SELECT_CONFIRMER_PERSON_COMMAND,
} from '../../../../../constants/prompt_commands';
import {
  modalConfirmAction,
  modalConfirmWithDataAction,
} from '../../../../../states/actions/modal.actions';
import { ConfirmerUser } from '../../../../../models/confirmer_user';
import { PersonelyService } from '../../../../../services/personely.service';
import { FilterPersonel } from '../../../../../models/api/request/personely/filter_personel_dto';
import { OK } from '../../../../../constants/HttpStatusCodes';
import { ProgressBarModule } from 'primeng/progressbar';
import { PersonDto } from '../../../../../models/api/response/person/person_dto';
import { ImageComponent } from "../../../image-component/image-component.component";
import { PersonItemComponent } from "../../../../person/person-item/person_item.component";

@Component({
  selector: 'app-select-confirmer',
  imports: [ProgressBarModule, ImageComponent, PersonItemComponent],
  templateUrl: './select-confirmer.html',
  styleUrl: './select-confirmer.css',
})
export class SelectConfirmer implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() promptCommand: string = '';
  // @Input() selectDepAdmin: boolean = false;
  @ViewChild('progressBar') progressBar: ElementRef | undefined;
  persons: PersonDto[] = [];

  htmlContent: SafeHtml = '';
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private store: Store,
    private personelyService: PersonelyService,
    private sanitizer: DomSanitizer
  ) {
    this.progressBar = elementRef;
  }
  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['description'] && !changes['description'].firstChange) {
    //   this.setContent(this.description);
    // }
  
   // if (changes['selectDepAdmin'] && !changes['selectDepAdmin'].firstChange) {
      const filter: FilterPersonel = {
        searchTerm: null,
        departCode: null,
        departName: null,
        engageType: null,
        sortByEngageDate: null,
        // postTypes: this.selectDepAdmin ? [3, 26, 27] : [],
      };
  
      this.filterPersonel(filter);
    //}
  }
  ngOnInit(): void {
    this.setContent(this.description);

    const filter: FilterPersonel = {
      searchTerm: null,
      departCode: null,
      departName: null,
      engageType: null,
      sortByEngageDate: null,
      // postTypes: this.selectDepAdmin ? [3,26,27] : [],
    };

    this.filterPersonel(filter);
  }
  private setContent(content: string) {
    this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(content); //bypasses Angular's built-in XSS protection
  }
  confirm(person: PersonDto) {
    switch (this.promptCommand) {
      case SELECT_CONFIRMER_PERSON_COMMAND:
        var confirmer: ConfirmerUser = {
          PersonCode: person.personCode,
          PostId: person.postId,
        };
        this.store.dispatch(
          modalConfirmWithDataAction({
            confirmCommand: CONFIRM_SELECT_CONFIRMER_COMMAND,
            data: confirmer,
          })
        );
        break;
    }
    // this.eventService.deleteImage(true)

    document.getElementById('btnCloseSelectConfirmerPromptModal')?.click();
  }
  search(searchTerm: string | null) {
    const filter: FilterPersonel = {
      searchTerm: searchTerm,
      departCode: null,
      departName: null,
      engageType: null,
      sortByEngageDate: null,
      // postTypes: this.selectDepAdmin ? [3,26,27] : [],
    };
    this.filterPersonel(filter);

  }
  filterPersonel(filter: FilterPersonel) {
    this.showLoading(true);
    this.personelyService.getPersons(true, 1, filter).subscribe({
      next: (data) => {
        this.showLoading(false);
        if (data.succeed) {
          console.log(data.data);
          this.persons = data.data; // assuming your API response has a `data` property

          //else this.uploadDocsTab?.nativeElement.click()
        } else if (data.responseCode != OK) {
          console.log(data.message);
        }
      },
      error: () => {
        this.showLoading(false);
      },
    });
  }

  showLoading(isLoading: boolean) {
    if (isLoading) {
      this.progressBar?.nativeElement.classList.add('show');
      this.progressBar?.nativeElement.classList.remove('gone');
    } else {
      this.progressBar?.nativeElement.classList.add('gone');
      this.progressBar?.nativeElement.classList.remove('show');
    }
  }
}
