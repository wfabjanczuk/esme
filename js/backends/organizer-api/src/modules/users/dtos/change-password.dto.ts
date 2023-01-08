import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../../../common/decorators/match.decorator';
import { Different } from '../../../common/decorators/different.decorator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(16)
  @MaxLength(128)
  @ApiProperty({ example: '&Y+sFaS{&d>8ycO)FLhF41qiQk{IYEb?' })
  oldPassword: string;

  @IsString()
  @MinLength(16)
  @MaxLength(128)
  @Different('oldPassword')
  @ApiProperty({ example: 'ZY[UPU,NBC<y2f8COStQr*b#@GwhnwGH' })
  newPassword: string;

  @Match('newPassword')
  @ApiProperty({ example: 'ZY[UPU,NBC<y2f8COStQr*b#@GwhnwGH' })
  confirmNewPassword: string;
}
