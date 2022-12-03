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
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @ApiProperty({ example: 'Rap Concert' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({ example: 'Annual music event' })
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  @ApiProperty({ example: 'Concert Street 1, Warsaw 01-234, Poland' })
  address: string;

  @IsOptional()
  @IsLatitude()
  @ApiProperty({ example: 52.2348373 })
  lat: number;

  @IsOptional()
  @IsLongitude()
  @ApiProperty({ example: 20.9840948 })
  lng: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2022-11-26T18:47:02.541Z' })
  timeStart: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2022-11-27T18:47:02.541Z' })
  timeEnd: string;
}
