import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Event } from '../events/event.entity';
import { Agency } from '../agencies/agency.entity';

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

  @Column()
  @ApiProperty({ example: 1 })
  eventId: number;

  @ManyToOne(() => Event, null, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  @ApiHideProperty()
  event: Event;

  @Column()
  @ApiProperty({ example: 1 })
  agencyId: number;

  @ManyToOne(() => Agency, null, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agencyId' })
  @ApiHideProperty()
  agency: Agency;
}

// TODO: add issue date creation and issue date closed
