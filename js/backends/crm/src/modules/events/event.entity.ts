import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Agency } from '../agencies/agency.entity';

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

  @Column()
  @ApiProperty({ example: 1 })
  agencyId: number;

  @ManyToOne(() => Agency, null, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agencyId' })
  @ApiHideProperty()
  agency: Agency;
}
