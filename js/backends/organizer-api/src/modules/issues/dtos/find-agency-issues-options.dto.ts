import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAgencyIssuesOptionsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  eventId?: number;
}
