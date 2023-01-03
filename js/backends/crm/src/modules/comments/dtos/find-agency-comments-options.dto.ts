import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAgencyCommentsOptionsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  issueId?: number;
}
