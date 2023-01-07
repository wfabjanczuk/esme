import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAgencyAnnouncementsOptionsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  eventId?: number;
}
