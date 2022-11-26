import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyAgentAgencyDto {
  @IsBoolean()
  @ApiProperty({ example: false })
  approved: boolean;
}
