import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetAgencyDto {
  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 1 })
  agencyId?: number;
}
