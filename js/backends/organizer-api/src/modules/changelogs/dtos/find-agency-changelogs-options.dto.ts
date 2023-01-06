import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAgencyChangelogsOptionsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  userId?: number;
}
