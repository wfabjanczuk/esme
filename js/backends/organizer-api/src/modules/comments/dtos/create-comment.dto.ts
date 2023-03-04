import { IsInt, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCommentDto {
  @IsString()
  @MaxLength(2000)
  @ApiProperty({ example: 'The ambulance is on the way.' })
  content: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ example: 1 })
  issueId: number;
}
