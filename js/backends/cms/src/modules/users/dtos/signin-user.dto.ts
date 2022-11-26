import { IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninUserDto {
  @IsEmail()
  @MaxLength(320)
  @ApiProperty({ example: 'jan@kowalski.com' })
  email: string;
}
