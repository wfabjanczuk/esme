import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAnnouncementsOptionsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  eventId?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  agencyId?: number;
}
