import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { Event } from './event.entity';
import { UpdateEventDto } from './dtos/update-event.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IdDto } from '../../common/dtos/id.dto';
import { AgencyManagerGuard } from '../../common/guards/agency-manager.guard';
import { AgencySupportGuard } from '../../common/guards/agency-support.guard';
import { AgencyEventsService } from './agency-events.service';
import { CreateAgencyEventDto } from './dtos/create-agency-event.dto';
import { User } from '../users/user.entity';

@Controller('agency/events')
@UseGuards(AuthenticationGuard)
@ApiTags('2. Agency: events')
export class AgencyEventsController {
  constructor(private agencyEventsService: AgencyEventsService) {}

  @Post()
  @UseGuards(AgencyManagerGuard)
  @ApiResponse({
    status: 201,
    type: Event,
  })
  @ApiBadRequestResponse({
    schema: {
      example: {
        statusCode: 400,
        message: 'Name is already taken',
        error: 'Bad Request',
      },
    },
  })
  async create(
    @CurrentUser() currentUser: User,
    @Body() body: CreateAgencyEventDto,
  ) {
    return this.agencyEventsService.create(body, currentUser);
  }

  @Get(':id')
  @UseGuards(AgencySupportGuard)
  @ApiResponse({
    status: 200,
    type: Event,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Event with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  findOne(@CurrentUser() currentUser: User, @Param() { id }: IdDto) {
    return this.agencyEventsService.findOne(id, currentUser.agencyId);
  }

  @Get()
  @UseGuards(AgencySupportGuard)
  @ApiResponse({
    status: 200,
    type: [Event],
  })
  async findAll(@CurrentUser() currentUser: User) {
    return this.agencyEventsService.findAll(currentUser.agencyId);
  }

  @Patch(':id')
  @UseGuards(AgencyManagerGuard)
  @ApiResponse({
    status: 200,
    type: Event,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Event with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  update(
    @CurrentUser() currentUser: User,
    @Param() { id }: IdDto,
    @Body() body: UpdateEventDto,
  ) {
    return this.agencyEventsService.update(id, body, currentUser);
  }

  @Delete(':id')
  @UseGuards(AgencyManagerGuard)
  @ApiResponse({
    status: 200,
    type: Event,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Event with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  async remove(@CurrentUser() currentUser: User, @Param() { id }: IdDto) {
    return this.agencyEventsService.remove(id, currentUser);
  }
}
