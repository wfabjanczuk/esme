import { CreateAgencyUserDto } from './create-agency-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class CreateUserDto extends CreateAgencyUserDto {
  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 1 })
  agencyId?: number;
}
