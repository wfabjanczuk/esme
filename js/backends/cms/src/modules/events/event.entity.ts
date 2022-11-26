import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Contact } from '../contacts/contact.entity';
import { Agency } from '../agencies/agency.entity';
import { Announcement } from '../announcements/announcement.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ length: 200, unique: true })
  @ApiProperty({ example: 'Rap Concert' })
  name: string;

  @Column({ length: 2000 })
  @ApiProperty({ example: 'Annual music event' })
  description: string;

  @Column({ length: 400 })
  @ApiProperty({ example: 'Concert Street 1, Warsaw 01-234, Poland' })
  address: string;

  @Column({ type: 'float' })
  @ApiProperty({ example: 52.2348373 })
  lat: number;

  @Column({ type: 'float' })
  @ApiProperty({ example: 20.9840948 })
  lng: number;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ example: '2022-11-26T18:47:02.541Z' })
  timeStart: Date;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ example: '2022-11-27T18:47:02.541Z' })
  timeEnd: Date;

  @ApiHideProperty()
  @ManyToOne(() => Agency, (agency) => agency.events)
  agency: Agency;

  @ApiHideProperty()
  @OneToMany(() => Contact, (contact) => contact.event)
  contacts: Contact[];

  @ApiHideProperty()
  @OneToMany(() => Announcement, (announcement) => announcement.event)
  announcements: Announcement[];
}
