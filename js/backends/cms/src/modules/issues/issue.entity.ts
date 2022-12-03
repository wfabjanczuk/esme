import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Event } from '../events/event.entity';
import { Comment } from '../comments/comment.entity';

export enum IssueStatus {
  toDo = 'to_do',
  inProgress = 'in_progress',
  resolved = 'resolved',
  cancelled = 'cancelled',
}

export enum IssuePriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ length: 200 })
  @ApiProperty({ example: 'Broken leg' })
  name: string;

  @Column({ length: 20000 })
  @ApiProperty({ example: 'Somebody has broken his leg.' })
  description: string;

  @Column({ length: 50 })
  @ApiProperty({ example: 'to do' })
  status: IssueStatus;

  @Column({ length: 50 })
  @ApiProperty({ example: 'medium' })
  priority: IssuePriority;

  @OneToMany(() => Comment, (comment) => comment.issue)
  @ApiHideProperty()
  comments: Comment[];

  @ManyToOne(() => Event, (event) => event.issues, {
    onDelete: 'CASCADE',
  })
  @ApiHideProperty()
  event: Event;
}
