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
export class Contact {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ length: 100 })
  @ApiProperty({ example: 'Jan' })
  firstName: string;

  @Column({ length: 100 })
  @ApiProperty({ example: 'Kowalski' })
  lastName: string;

  @Column({ length: 320 })
  @ApiProperty({ example: 'jan@kowalski.com' })
  email: string;

  @Column({ length: 30 })
  @ApiProperty({ example: '+48123456789' })
  phoneNumber: string;

  @Column({ length: 2000 })
  @ApiProperty({ example: 'Available 24/7' })
  additionalNotes: string;

  @Column()
  @ApiProperty({ example: 1 })
  eventId: number;

  @ManyToOne(() => Event, null, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  @ApiHideProperty()
  event: Event;

  @Column()
  @ApiProperty({ example: 1 })
  agencyId: number;

  @ManyToOne(() => Agency, null, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'agencyId' })
  @ApiHideProperty()
  agency: Agency;
}
