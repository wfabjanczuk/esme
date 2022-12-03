import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IssuePriority, IssueStatus } from '../issue.entity';

export class UpdateIssueDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @ApiProperty({ example: 'Broken leg' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  @ApiProperty({ example: 'Somebody has broken his leg.' })
  description: string;

  @IsOptional()
  @IsEnum(IssueStatus)
  @MaxLength(50)
  @ApiProperty({ example: IssueStatus.toDo })
  status: IssueStatus;

  @IsOptional()
  @IsEnum(IssuePriority)
  @MaxLength(50)
  @ApiProperty({ example: IssuePriority.medium })
  priority: IssuePriority;
}
