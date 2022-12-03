import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Issue } from '../issues/issue.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ length: 2000 })
  @ApiProperty({ example: 'The ambulance is on the way.' })
  content: string;

  @ManyToOne(() => Issue, (issue) => issue.comments, {
    onDelete: 'CASCADE',
  })
  @ApiHideProperty()
  issue: Issue;
}
