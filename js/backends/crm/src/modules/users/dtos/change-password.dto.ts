import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../../../common/decorators/match.decorator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(16)
  @MaxLength(128)
  @ApiProperty({ example: '&Y+sFaS{&d>8ycO)FLhF41qiQk{IYEb?' })
  password: string;

  @Match('password')
  @ApiProperty({ example: '&Y+sFaS{&d>8ycO)FLhF41qiQk{IYEb?' })
  confirmPassword: string;
}
