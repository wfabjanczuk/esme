import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { FindAgencyContactsOptionsDto } from './find-agency-contacts-options.dto';

export class FindContactsOptionsDto extends FindAgencyContactsOptionsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  agencyId?: number;
}
