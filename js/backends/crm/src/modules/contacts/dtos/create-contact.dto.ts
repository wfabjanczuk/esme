import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'Jan' })
  firstName: string;

  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'Kowalski' })
  lastName: string;

  @IsEmail()
  @MaxLength(320)
  @ApiProperty({ example: 'jan@kowalski.com' })
  email: string;

  @IsPhoneNumber()
  @MaxLength(30)
  @ApiProperty({ example: '+48123456789' })
  phoneNumber: string;

  @IsString()
  @MaxLength(2000)
  @ApiProperty({ example: 'Available 24/7' })
  additionalNotes: string;

  @IsInt()
  @ApiProperty({ example: 1 })
  eventId: number;
}
