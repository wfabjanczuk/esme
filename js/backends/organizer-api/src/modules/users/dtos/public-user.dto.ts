import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRole } from '../user-role.enum';
import { Column } from 'typeorm';

export class PublicUserDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'jan@kowalski.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'Jan' })
  firstName: string;

  @Expose()
  @ApiProperty({ example: 'Kowalski' })
  lastName: string;

  @Expose()
  @ApiProperty({ example: '+48123456789' })
  phoneNumber: string;

  @Expose()
  @ApiProperty({ example: '2022-11-26T18:47:02.541Z' })
  timeCreated: Date;

  @Expose()
  @ApiProperty({ example: '2022-11-26T18:47:02.541Z' })
  timeSignOut: Date;

  @Expose()
  @ApiProperty({ example: UserRole.agencyOwner })
  role: UserRole;

  @Expose()
  @ApiProperty({ example: 1 })
  agencyId?: number;
}
