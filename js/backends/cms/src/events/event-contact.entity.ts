import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from './event.entity';

@Entity()
export class EventContact {
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

  @ManyToOne(() => Event, (event) => event.contacts)
  event: Event;
}
