import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @MaxLength(200)
  @IsOptional()
  @ApiProperty({ example: 'Rap Concert' })
  name: string;

  @IsString()
  @MaxLength(2000)
  @IsOptional()
  @ApiProperty({ example: 'Annual music event' })
  description: string;

  @IsString()
  @MaxLength(400)
  @IsOptional()
  @ApiProperty({ example: 'Concert Street 1, Warsaw 01-234, Poland' })
  address: string;

  @IsLatitude()
  @IsOptional()
  @ApiProperty({ example: 52.2348373 })
  lat: number;

  @IsLongitude()
  @IsOptional()
  @ApiProperty({ example: 20.9840948 })
  lng: number;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '2022-11-26T18:47:02.541Z' })
  timeStart: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '2022-11-27T18:47:02.541Z' })
  timeEnd: string;
}
