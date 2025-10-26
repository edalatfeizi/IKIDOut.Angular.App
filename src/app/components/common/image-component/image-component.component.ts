import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NO_ERRORS_SCHEMA,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { ResourcesService } from '../../../services/resources.service'
import { ImageModule } from 'primeng/image'
import { AvatarModule } from 'primeng/avatar'
import { ASSETS_PATH } from '../../../constants/app_constants'
type User = {}
@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule, ImageModule, AvatarModule],
  templateUrl: './image-component.component.html',
  styleUrl: './image-component.component.scss',
  schemas: [NO_ERRORS_SCHEMA],
})
export class ImageComponent implements OnInit, OnChanges {
  @Input() fileId: number = 0;
  @Input() fileContent: string = '';
  @Input() alt: string = '';
  @Input() nationalCode?: string;
  @Input() isPersonImage = true;
  @Input() isCircular = true;
  @Input() width: string = '';
  @Input() showInList = false;

  image: any;
  avatarPath = `${ASSETS_PATH}/images/_avatar.png`;
  noImagePath = `${ASSETS_PATH}/images/img_no_image.png`;
  imageLoaded: boolean = false;
  shimmerGradient = 'linear-gradient(to right, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%)';

  constructor(private resourcesService: ResourcesService) {}

  ngOnInit(): void {
    this.loadImage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nationalCode'] && !changes['nationalCode'].firstChange) {
      this.loadImage();
    }
  }

  private loadImage(): void {
    this.imageLoaded = false;
    this.image = this.isCircular ? this.avatarPath : this.noImagePath;

    if (this.nationalCode && this.nationalCode !== '') {
      this.resourcesService.getPersonImage(this.nationalCode).subscribe(
        (data) => this.createImageFromBlob(data),
        (error) => {
          console.log(error);
          this.onDocImageError(this);
        }
      );
    } else {
      this.onDocImageError(this);
    }
  }

  private createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.image = reader.result;
        this.imageLoaded = true;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

 onDocImageError(event: any) {
    this.image = this.isCircular ? this.avatarPath : this.noImagePath;
    this.imageLoaded = true;
  }

  onImageContextMenu(event: MouseEvent): void {
    event.preventDefault();
  }
}
