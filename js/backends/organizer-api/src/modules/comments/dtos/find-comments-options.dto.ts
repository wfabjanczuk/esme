import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { FindAgencyCommentsOptionsDto } from './find-agency-comments-options.dto';

export class FindCommentsOptionsDto extends FindAgencyCommentsOptionsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  agencyId?: number;
}
