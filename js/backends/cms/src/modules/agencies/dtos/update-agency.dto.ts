import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAgencyDto {
  @IsString()
  @MaxLength(200)
  @IsOptional()
  @ApiProperty({ example: 'Live Concert Agency' })
  name: string;

  @IsString()
  @MaxLength(400)
  @IsOptional()
  @ApiProperty({ example: 'Concert Street 1, Warsaw 01-234, Poland' })
  address: string;

  @IsString()
  @IsUrl()
  @MaxLength(400)
  @IsOptional()
  @ApiProperty({ example: 'https://live-concert-agency.com' })
  website: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: false })
  approved: boolean;
}