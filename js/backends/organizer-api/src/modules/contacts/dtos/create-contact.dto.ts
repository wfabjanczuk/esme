import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ example: 'Jan' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
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
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ example: 1 })
  eventId: number;
}
