import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { Agency } from './agency.entity';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventsService } from '../events/events.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminGuard } from '../../common/guards/admin.guard';
import { VerifyAgencyDto } from './dtos/verify-agency.dto';
import { IdDto } from '../../common/dtos/id.dto';

@Controller('agencies')
@UseGuards(AuthenticationGuard, AdminGuard)
@ApiTags('1. Admin: agencies')
export class AgenciesController {
  constructor(
    private agenciesService: AgenciesService,
    private eventsService: EventsService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: [Agency],
  })
  findAll() {
    return this.agenciesService.findAll();
  }

  @Patch(':agencyId/verify')
  @ApiResponse({
    status: 200,
    type: Agency,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Agency with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  verify(
    @CurrentUser() currentUser,
    @Param() { id }: IdDto,
    @Body() body: VerifyAgencyDto,
  ) {
    return this.agenciesService.verify(id, body, currentUser);
  }

  @Delete(':agencyId')
  @ApiResponse({
    status: 200,
    type: Agency,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Agency with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  async remove(@CurrentUser() currentUser, @Param() { id }: IdDto) {
    const agencyEventsCount = await this.eventsService.countAll(id);
    if (agencyEventsCount) {
      throw new BadRequestException('Agency has existing events');
    }
    return this.agenciesService.remove(id, currentUser);
  }
}
