import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Agency } from './agency.entity';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { ApiBadRequestResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterAgencyDto } from './dtos/register-agency.dto';
import { UpdateAgencyDto } from './dtos/update-agency.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AgencyOwnerGuard } from '../../common/guards/agency-owner.guard';
import { AgencySupportGuard } from '../../common/guards/agency-support.guard';
import { AgencyService } from './agency.service';

@Controller('agency')
@ApiTags('2. Agency')
export class AgencyController {
  constructor(private agencyService: AgencyService) {}

  @Post()
  @ApiResponse({
    status: 201,
    type: Agency,
  })
  @ApiBadRequestResponse({
    schema: {
      example: {
        statusCode: 400,
        message: 'Owner email is already taken',
        error: 'Bad Request',
      },
    },
  })
  @ApiBadRequestResponse({
    schema: {
      example: {
        statusCode: 400,
        message: 'Agency name is already taken',
        error: 'Bad Request',
      },
    },
  })
  register(@CurrentUser() currentUser, @Body() body: RegisterAgencyDto) {
    return this.agencyService.register(body);
  }

  @Get()
  @UseGuards(AuthenticationGuard, AgencySupportGuard)
  @ApiResponse({
    status: 200,
    type: Agency,
  })
  get(@CurrentUser() currentUser) {
    return currentUser.agency;
  }

  @Patch()
  @UseGuards(AuthenticationGuard, AgencyOwnerGuard)
  @ApiResponse({
    status: 200,
    type: Agency,
  })
  update(@CurrentUser() currentUser, @Body() body: UpdateAgencyDto) {
    return this.agencyService.update(body, currentUser);
  }

  @Delete()
  @UseGuards(AuthenticationGuard, AgencyOwnerGuard)
  @ApiResponse({
    status: 200,
    type: Agency,
  })
  async remove(@CurrentUser() currentUser) {
    return this.agencyService.remove(currentUser);
  }
}
