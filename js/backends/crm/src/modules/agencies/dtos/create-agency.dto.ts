import { IsString, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgencyDto {
  @IsString()
  @MaxLength(200)
  @ApiProperty({ example: 'Live Concert Agency' })
  name: string;

  @IsString()
  @MaxLength(400)
  @ApiProperty({ example: 'Concert Street 1, Warsaw 01-234, Poland' })
  address: string;

  @IsString()
  @IsUrl()
  @MaxLength(400)
  @ApiProperty({ example: 'https://live-concert-agency.com' })
  website: string;
}
