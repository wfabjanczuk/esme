import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateAgencyEventDto } from './create-agency-event.dto';

export class CreateEventDto extends CreateAgencyEventDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  agencyId: number;
}
