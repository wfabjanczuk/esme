import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IssuePriority, IssueStatus } from '../issue.entity';

export class UpdateIssueDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty({ example: 'Broken leg' })
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20000)
  @ApiProperty({ example: 'Somebody has broken his leg.' })
  description: string;

  @IsOptional()
  @IsEnum(IssueStatus)
  @ApiProperty({ example: IssueStatus.toDo })
  status: IssueStatus;

  @IsOptional()
  @IsEnum(IssuePriority)
  @ApiProperty({ example: IssuePriority.medium })
  priority: IssuePriority;
}
