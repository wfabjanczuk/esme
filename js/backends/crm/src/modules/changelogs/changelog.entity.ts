import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { Agency } from '../agencies/agency.entity';

export enum ChangeType {
  insert = 'insert',
  update = 'update',
  delete = 'delete',
}

@Entity()
export class Changelog {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 1 })
  entityId: number;

  @Column({ length: 200 })
  @ApiProperty({ example: 'agency' })
  entityClass: string;

  @Column({ length: 200 })
  @ApiProperty({ example: 'update' })
  type: ChangeType;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ example: '2022-11-26T18:47:02.541Z' })
  time: Date;

  @Column({ type: 'json', nullable: true })
  @ApiProperty({
    example:
      '{"id":1,"name":"Live Concert Agency","address":"Concert Street 1, Warsaw 01-234, Poland","website":"https://live-concert-agency.com","approved":true}',
  })
  after?: string;

  @Column()
  @ApiProperty({ example: 1 })
  userId?: number;

  @ManyToOne(() => User, null, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @ApiHideProperty()
  user: User;

  @Column({ nullable: true })
  @ApiProperty({ example: null })
  userAgencyId?: number;

  @ManyToOne(() => Agency, null, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userAgencyId' })
  @ApiHideProperty()
  userAgency?: Agency;
}
