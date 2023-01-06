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

@Entity()
export class Announcement {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ length: 2000 })
  @ApiProperty({
    example: "Dear All, we've stopped the concert for 10 minutes.",
  })
  content: string;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ example: '2022-12-03T12:42:03.856Z' })
  timeSent: Date;

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
