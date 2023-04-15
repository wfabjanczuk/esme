import { ApiProperty } from '@nestjs/swagger';

export class Participant {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'jan@kowalski.com' })
  email: string;

  @ApiProperty({ example: '+48123456789' })
  phoneNumber: string;

  @ApiProperty({ example: '2022-11-26T18:47:02.541Z' })
  timeCreated: string;

  @ApiProperty({ example: '2022-11-26T18:47:02.541Z' })
  timeSignOut: string;
}
