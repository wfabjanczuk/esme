import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { FindAgencyChangelogsOptionsDto } from './find-agency-changelogs-options.dto';

export class FindChangelogsOptionsDto extends FindAgencyChangelogsOptionsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  userAgencyId?: number;
}
