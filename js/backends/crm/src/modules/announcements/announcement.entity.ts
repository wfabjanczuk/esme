import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Event } from '../events/event.entity';

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

  @ManyToOne(() => Event, (event) => event.announcements, {
    onDelete: 'CASCADE',
  })
  @ApiHideProperty()
  event: Event;
}
