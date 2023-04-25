import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IssuePriority, IssueStatus } from '../issue.entity';
import { Transform } from 'class-transformer';

export class CreateIssueDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty({ example: 'Broken leg' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20000)
  @ApiProperty({ example: 'Somebody has broken his leg.' })
  description: string;

  @IsEnum(IssuePriority)
  @ApiProperty({ example: IssuePriority.medium })
  priority: IssuePriority;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ example: 1 })
  eventId: number;
}
