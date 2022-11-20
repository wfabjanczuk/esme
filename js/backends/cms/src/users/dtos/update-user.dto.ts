import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  @ApiProperty({ example: 'Jan' })
  firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @ApiProperty({ example: 'Kowalski' })
  lastName?: string;
}
