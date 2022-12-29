import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindCommentsOptionsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  issueId?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  agencyId?: number;
}
