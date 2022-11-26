import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { EventContact } from './event-contact.entity';
import { EventAgency } from '../event-agencies/event-agency.entity';
import { EventAnnouncement } from './event-announcement.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ length: 200, unique: true })
  name: string;

  @Column({ length: 2000 })
  description: string;

  @Column({ length: 400 })
  address: string;

  @Column({ type: 'float' })
  lng: number;

  @Column({ type: 'float' })
  lat: number;

  @Column({ type: 'timestamptz' })
  timeStart: Date;

  @Column({ type: 'timestamptz' })
  timeEnd: Date;

  @Column({ type: 'boolean', default: false })
  approved: boolean;

  @ApiHideProperty()
  @ManyToOne(() => EventAgency, (agency) => agency.events)
  agency: EventAgency;

  @ApiHideProperty()
  @OneToMany(() => EventContact, (contact) => contact.event)
  contacts: EventContact[];

  @ApiHideProperty()
  @OneToMany(() => EventAnnouncement, (announcement) => announcement.event)
  announcements: EventAnnouncement[];
}
