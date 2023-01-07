import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAgencyContactsOptionsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  eventId?: number;
}
