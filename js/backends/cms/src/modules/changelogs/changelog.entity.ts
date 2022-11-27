import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';

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
  @ApiProperty({ example: 'insert' })
  type: ChangeType;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ example: '2022-11-26T18:47:02.541Z' })
  time: Date;

  @Column({ type: 'json', nullable: true })
  @ApiProperty({ example: 'insert' })
  after?: string;

  @ManyToOne(() => User, (user) => user.changelogs, { onDelete: 'SET NULL' })
  @ApiHideProperty()
  author?: User;
}
