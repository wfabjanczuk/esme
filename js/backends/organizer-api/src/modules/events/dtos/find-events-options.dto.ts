import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindEventsOptionsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  agencyId?: number;
}
