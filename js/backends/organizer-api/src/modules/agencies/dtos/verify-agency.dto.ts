import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyAgencyDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false })
  approved: boolean;
}
