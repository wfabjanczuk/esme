import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { FindAgencyIssuesOptionsDto } from './find-agency-issues-options.dto';

export class FindIssuesOptionsDto extends FindAgencyIssuesOptionsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  agencyId?: number;
}
