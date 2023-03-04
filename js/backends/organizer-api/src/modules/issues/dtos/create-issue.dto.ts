import { IsEnum, IsInt, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IssuePriority, IssueStatus } from '../issue.entity';
import { Transform } from 'class-transformer';

export class CreateIssueDto {
  @IsString()
  @MaxLength(200)
  @ApiProperty({ example: 'Broken leg' })
  name: string;

  @IsString()
  @MaxLength(20000)
  @ApiProperty({ example: 'Somebody has broken his leg.' })
  description: string;

  @IsEnum(IssueStatus)
  @MaxLength(50)
  @ApiProperty({ example: IssueStatus.toDo })
  status: IssueStatus;

  @IsEnum(IssuePriority)
  @MaxLength(50)
  @ApiProperty({ example: IssuePriority.medium })
  priority: IssuePriority;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ example: 1 })
  eventId: number;
}
