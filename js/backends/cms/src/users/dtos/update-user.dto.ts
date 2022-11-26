import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiProperty({ example: 'Jan' })
  firstName?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiProperty({ example: 'Kowalski' })
  lastName?: string;
}
