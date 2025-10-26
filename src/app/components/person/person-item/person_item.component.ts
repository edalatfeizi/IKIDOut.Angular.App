import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { ImageComponent } from '../../common/image-component/image-component.component'
import { PersonDto } from '../../../models/api/response/person/person_dto'
import { ASSETS_PATH } from '../../../constants/app_constants'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs'
import { Actions, ofType } from '@ngrx/effects'
import { BaseComponent } from '../../../base/base_component'
import { randomIntFromInterval } from '../../utils/utils'
export type PersonProfileShare = {
  personNationalCode: string,
  isProfileShared: boolean
}
@Component({
  selector: 'app-person-item',
  standalone: true,
  imports: [CommonModule, ImageComponent],
  templateUrl: './person_item.component.html',
  styleUrl: './person_item.component.scss',
})
export class PersonItemComponent extends BaseComponent implements OnInit , OnDestroy, AfterViewInit{
  @Input() Person: PersonDto | null = null
  @Input() isListItem: boolean = true
  @Input() isActive: boolean = true
  isProfileShared = false
  @Output() showProfileEvent = new EventEmitter<PersonDto>()

  // shareProfileState$: Observable<boolean>;
  // private subscription!: Subscription;

  shareProfile$: Observable<void> | undefined
  private actionSubscription: Subscription | undefined

  path: string | null = null

  imgCoverImages: string[] = [
    `/images/img_cover_1.png`,
    '/images/img_cover_4.png',
    '/images/img_cover_5.png',
  ]
  constructor(
    private router: Router,
    protected override store: Store,
    private actions$: Actions
  ) {
    super(store)
    // this.shareProfile$ = this.store.select(selectShareProfileState)

  
  }
  ngAfterViewInit(): void {
 
  }
  override ngOnDestroy(): void {
    if (this.actionSubscription) this.actionSubscription.unsubscribe()
  }


  override ngOnInit(): void {
    this.path = `${ASSETS_PATH}${
      this.imgCoverImages[randomIntFromInterval(0, 2)]
    }`
   
    // this.subscription = this.shareProfileState$.subscribe((isProfileShared) => {
    //   this.isProfileShared = isProfileShared
    // })
  }
  showProfile(person: PersonDto) {
    this.showProfileEvent.emit(person)
    // this.router.navigate(['/person'], {
    //   // state: { person: person, depId: HR_DEP_ID },
    //   queryParams: { nid: person.nationalCode, active: this.isActive },
    // })
  }

  showSharedDocs(empNationalCode: string) {
  
  }
}


