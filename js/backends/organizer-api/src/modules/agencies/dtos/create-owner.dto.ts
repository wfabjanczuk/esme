import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../../../common/decorators/match.decorator';

export class CreateOwnerDto {
  @IsEmail()
  @MaxLength(320)
  @ApiProperty({ example: 'jan@kowalski.com' })
  email: string;

  @IsString()
  @MinLength(16)
  @MaxLength(128)
  @ApiProperty({ example: '&Y+sFaS{&d>8ycO)FLhF41qiQk{IYEb?' })
  password: string;

  @Match('password')
  @ApiProperty({ example: '&Y+sFaS{&d>8ycO)FLhF41qiQk{IYEb?' })
  confirmPassword: string;

  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'Jan' })
  firstName: string;

  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'Kowalski' })
  lastName: string;

  @IsPhoneNumber()
  @MaxLength(30)
  @ApiProperty({ example: '+48123456789' })
  phoneNumber: string;
}
