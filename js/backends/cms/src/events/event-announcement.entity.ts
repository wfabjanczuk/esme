import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from './event.entity';

@Entity()
export class EventAnnouncement {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ length: 2000 })
  content: string;

  @Column({ type: 'timestamptz' })
  timeSent: Date;

  @ManyToOne(() => Event, (event) => event.announcements)
  event: Event;
}
