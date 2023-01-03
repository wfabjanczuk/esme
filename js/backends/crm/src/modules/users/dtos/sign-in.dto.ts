import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @IsEmail()
  @MaxLength(320)
  @ApiProperty({ example: 'jan@kowalski.com' })
  email: string;

  @IsString()
  @MinLength(16)
  @MaxLength(128)
  @ApiProperty({ example: '&Y+sFaS{&d>8ycO)FLhF41qiQk{IYEb?' })
  password: string;
}
