import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { CreateAgencyEventDto } from './create-agency-event.dto';

export class CreateEventDto extends CreateAgencyEventDto {
  @IsInt()
  @ApiProperty({ example: 1 })
  agencyId: number;
}
