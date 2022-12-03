import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContactDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'Jan' })
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'Kowalski' })
  lastName: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  @ApiProperty({ example: 'jan@kowalski.com' })
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  @MaxLength(30)
  @ApiProperty({ example: '+48123456789' })
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({ example: 'Available 24/7' })
  additionalNotes: string;
}
