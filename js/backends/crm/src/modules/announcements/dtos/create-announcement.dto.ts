import { IsInt, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnnouncementDto {
  @IsString()
  @MaxLength(2000)
  @ApiProperty({
    example: "Dear All, we've stopped the concert for 10 minutes.",
  })
  content: string;

  @IsInt()
  @ApiProperty({ example: 1 })
  eventId: number;
}
