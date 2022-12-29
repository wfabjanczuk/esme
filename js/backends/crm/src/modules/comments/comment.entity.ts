import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Issue } from '../issues/issue.entity';
import { Agency } from '../agencies/agency.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ length: 2000 })
  @ApiProperty({ example: 'The ambulance is on the way.' })
  content: string;

  @Column()
  @ApiProperty({ example: 1 })
  issueId: number;

  @ManyToOne(() => Issue, null, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'issueId' })
  @ApiHideProperty()
  issue: Issue;

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
