import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAnnouncementDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({
    example: "Dear All, we've stopped the concert for 10 minutes.",
  })
  content: string;
}
