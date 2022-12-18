import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Changelog } from '../changelogs/changelog.entity';
import { Agency } from '../agencies/agency.entity';

export enum UserRole {
  superAdmin = 'super_admin',
  admin = 'admin',
  agencyOwner = 'agency_owner',
  agencyManager = 'agency_manager',
  agencySupport = 'agency_support',
}

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

  @Column({ length: 30, nullable: true })
  @ApiProperty({ example: '+48123456789' })
  phoneNumber: string;

  @Column({ length: 50 })
  @ApiProperty({ example: UserRole.agencyOwner })
  role: UserRole;

  @Column({ nullable: true })
  @ApiProperty({ example: 1 })
  agencyId?: number;

  @ManyToOne(() => Agency, (agency) => agency.users)
  @JoinColumn({ name: 'agencyId' })
  @ApiHideProperty()
  agency?: Agency;

  @OneToMany(() => Changelog, (changelog) => changelog.author)
  @ApiHideProperty()
  changelogs: Changelog[];
}
