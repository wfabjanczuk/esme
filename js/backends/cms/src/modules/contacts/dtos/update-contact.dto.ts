import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContactDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiProperty({ example: 'Jan' })
  firstName: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiProperty({ example: 'Kowalski' })
  lastName: string;

  @IsEmail()
  @MaxLength(320)
  @IsOptional()
  @ApiProperty({ example: 'jan@kowalski.com' })
  email: string;

  @IsPhoneNumber()
  @MaxLength(30)
  @IsOptional()
  @ApiProperty({ example: '+48123456789' })
  phoneNumber: string;

  @IsString()
  @MaxLength(2000)
  @IsOptional()
  @ApiProperty({ example: 'Available 24/7' })
  additionalNotes: string;
}
