import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({ example: 'The ambulance is on the way.' })
  content: string;
}
