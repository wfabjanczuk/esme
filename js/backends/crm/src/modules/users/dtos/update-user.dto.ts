import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'Jan' })
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'Kowalski' })
  lastName?: string;

  @IsOptional()
  @IsPhoneNumber()
  @MaxLength(30)
  @ApiProperty({ example: '+48123456789' })
  phoneNumber: string;
}
