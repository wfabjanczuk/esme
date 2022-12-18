import { IsObject, ValidateNested } from 'class-validator';
import { CreateOwnerDto } from './create-owner.dto';
import { Type } from 'class-transformer';
import { CreateAgencyDto } from './create-agency.dto';

export class RegisterAgencyDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAgencyDto)
  agency: CreateAgencyDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateOwnerDto)
  owner: CreateOwnerDto;
}
