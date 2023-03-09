import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAgencyEventDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @ApiProperty({ example: 'Rap Concert' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({ example: 'Annual music event' })
  description: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(400)
  @ApiProperty({ example: 'Concert Street 1, Warsaw 01-234, Poland' })
  address: string;

  @IsLatitude()
  @ApiProperty({ example: 52.2348373 })
  lat: number;

  @IsLongitude()
  @ApiProperty({ example: 20.9840948 })
  lng: number;

  @IsDateString()
  @ApiProperty({ example: '2022-11-26T18:47:02.541Z' })
  timeStart: string;

  @IsDateString()
  @ApiProperty({ example: '2022-11-27T18:47:02.541Z' })
  timeEnd: string;
}
