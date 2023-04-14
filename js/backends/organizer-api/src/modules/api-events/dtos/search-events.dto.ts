import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchEventsDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  @ApiProperty({ example: 'Rap Concert' })
  query: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  @ApiProperty({ example: '2022-11-26T18:47:02.541Z' })
  from: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  @ApiProperty({ example: '2022-11-27T18:47:02.541Z' })
  to: string;
}
