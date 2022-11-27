import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Changelog } from '../changelogs/changelog.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ length: 100 })
  @ApiProperty({ example: 'Jan' })
  firstName: string;

  @Column({ length: 100 })
  @ApiProperty({ example: 'Kowalski' })
  lastName: string;

  @Column({ length: 320, unique: true })
  @ApiProperty({ example: 'jan@kowalski.com' })
  email: string;

  @Column({ length: 30, nullable: true, unique: true })
  @ApiProperty({ example: '+48123456789' })
  phoneNumber: string;

  @ManyToOne(() => Changelog, (changelog) => changelog.author)
  @ApiHideProperty()
  changelogs: Changelog[];
}
