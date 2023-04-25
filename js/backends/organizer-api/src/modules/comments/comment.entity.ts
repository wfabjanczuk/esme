import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Issue } from '../issues/issue.entity';
import { Agency } from '../agency/agency.entity';
import { User } from '../users/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ length: 2000 })
  @ApiProperty({ example: 'The ambulance is on the way.' })
  content: string;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ example: '2022-11-26T18:47:02.541Z' })
  timeCreated: Date;

  @Column()
  @ApiProperty({ example: 1 })
  authorId: number;

  @ManyToOne(() => User, null, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  @ApiHideProperty()
  author: User;

  @Column()
  @ApiProperty({ example: 1 })
  issueId: number;

  @ManyToOne(() => Issue, null, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'issueId' })
  @ApiHideProperty()
  issue: Issue;

  @Column()
  @ApiProperty({ example: 1 })
  agencyId: number;

  @ManyToOne(() => Agency, null, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agencyId' })
  @ApiHideProperty()
  agency: Agency;
}
