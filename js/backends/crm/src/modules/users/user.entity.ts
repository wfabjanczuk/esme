import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Agency } from '../agencies/agency.entity';
import { UserRole } from './user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ length: 320, nullable: false, unique: true })
  @ApiProperty({ example: 'jan@kowalski.com' })
  email: string;

  @Column({ length: 200 })
  @ApiHideProperty()
  password: string;

  @Column({ length: 100 })
  @ApiProperty({ example: 'Jan' })
  firstName: string;

  @Column({ length: 100 })
  @ApiProperty({ example: 'Kowalski' })
  lastName: string;

  @Column({ length: 30 })
  @ApiProperty({ example: '+48123456789' })
  phoneNumber: string;

  @Column()
  @ApiProperty({ example: UserRole.agencyOwner })
  role: UserRole;

  @Column({ nullable: true })
  @ApiProperty({ example: 1 })
  agencyId?: number;

  @ManyToOne(() => Agency, null, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agencyId' })
  @ApiHideProperty()
  agency?: Agency;
}
