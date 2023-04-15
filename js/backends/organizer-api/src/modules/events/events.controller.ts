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
import { EventsService } from './events.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { User } from '../users/user.entity';

@Controller('agency/events')
@UseGuards(AuthenticationGuard)
@ApiTags('2. Organizer: events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

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
  create(@CurrentUser() currentUser: User, @Body() body: CreateEventDto) {
    return this.eventsService.create(body, currentUser);
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
  findOne(@CurrentUser() { agencyId }: User, @Param() { id }: IdDto) {
    return this.eventsService.findOne(id, agencyId);
  }

  @Get()
  @UseGuards(AgencySupportGuard)
  @ApiResponse({
    status: 200,
    type: [Event],
  })
  findAll(@CurrentUser() { agencyId }: User) {
    return this.eventsService.findAll(agencyId);
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
    return this.eventsService.update(id, body, currentUser);
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
  remove(@CurrentUser() currentUser: User, @Param() { id }: IdDto) {
    return this.eventsService.remove(id, currentUser);
  }
}
