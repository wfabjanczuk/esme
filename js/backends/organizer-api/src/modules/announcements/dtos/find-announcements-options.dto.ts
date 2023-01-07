import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { FindAgencyAnnouncementsOptionsDto } from './find-agency-announcements-options.dto';

export class FindAnnouncementsOptionsDto extends FindAgencyAnnouncementsOptionsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  agencyId?: number;
}
