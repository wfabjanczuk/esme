import { IsNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsString()
  @MaxLength(2000)
  @ApiProperty({ example: 'The ambulance is on the way.' })
  content: string;

  @IsNumber()
  @ApiProperty({ example: 1 })
  issueId: number;
}
