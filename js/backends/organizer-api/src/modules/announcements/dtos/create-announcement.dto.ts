import { IsInt, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateAnnouncementDto {
  @IsString()
  @MaxLength(2000)
  @ApiProperty({
    example: "Dear All, we've stopped the concert for 10 minutes.",
  })
  content: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ example: 1 })
  eventId: number;
}
