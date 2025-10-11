import { BaseDto } from '../../base_dto';

export interface PersonDto extends BaseDto {
  firstName: string;
  lastName: string;
  personCode: string;
  posttxt: string;
  departName: string;
  fatherName: string;
  nationalCode: string;
  jobTitletxt: string;
  departTitle: string;
  engageType: string;
  engageDate: string;
  isProfileShared: boolean;
  sharedFolderId: number;
}
