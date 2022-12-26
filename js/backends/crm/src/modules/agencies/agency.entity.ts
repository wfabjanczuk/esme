import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';

@Entity()
export class Agency {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ length: 200, unique: true })
  @ApiProperty({ example: 'Live Concert Agency' })
  name: string;

  @Column({ length: 400 })
  @ApiProperty({ example: 'Concert Street 1, Warsaw 01-234, Poland' })
  address: string;

  @Column({ length: 400, nullable: true })
  @ApiProperty({ example: 'https://live-concert-agency.com' })
  website: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ example: false })
  approved: boolean;

  @OneToMany(() => User, (user) => user.agency)
  @ApiHideProperty()
  users: User[];

  @OneToMany(() => Event, (event) => event.agency)
  @ApiHideProperty()
  events: Event[];
}