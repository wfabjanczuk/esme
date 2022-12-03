import { IsEmail, IsPhoneNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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
}
