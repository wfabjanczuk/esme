import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { AgenciesService } from '../agencies/agencies.service';
import { CurrentUser } from '../../decorators/current-user.decorator';

@Controller('events')
@ApiTags('Events')
@UseGuards(AuthGuard)
export class EventsController {
  constructor(
    private eventsService: EventsService,
    private agenciesService: AgenciesService,
  ) {}

  @Post('')
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
  async createEvent(@CurrentUser() currentUser, @Body() body: CreateEventDto) {
    const agency = await this.agenciesService.findOne(body.agencyId);
    if (!agency.approved) {
      throw new BadRequestException('Agency is not approved by administrators');
    }
    return this.eventsService.create(body, agency, currentUser);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Event,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Event with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  findEventById(@Param('id') id: string) {
    return this.eventsService.findOne(parseInt(id));
  }

  @Get('')
  @ApiResponse({
    status: 200,
    type: [Event],
  })
  findAllEvents(@Query('agencyId') agencyId?: string) {
    return this.eventsService.findAll(agencyId);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: Event,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Event with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  updateEvent(
    @CurrentUser() currentUser,
    @Param('id') id: string,
    @Body() body: UpdateEventDto,
  ) {
    return this.eventsService.update(parseInt(id), body, currentUser);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    type: Event,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Event with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  async removeEvent(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.eventsService.remove(parseInt(id), currentUser);
  }
}
