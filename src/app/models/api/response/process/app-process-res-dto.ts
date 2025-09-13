import { BaseDto } from '../../base_dto';
import { ProcessStepResDto } from './process-step-res-dto';

export interface AppProcessResDto extends BaseDto {
  name: string;
  description: string;
  steps: ProcessStepResDto[];
}
