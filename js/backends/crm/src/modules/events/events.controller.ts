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
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { AgenciesService } from '../agencies/agencies.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IdDto } from '../../common/dtos/id.dto';
import { AgencyManagerGuard } from '../../common/guards/agency-manager.guard';

@Controller('events')
@UseGuards(AuthenticationGuard, AgencyManagerGuard)
@ApiTags('1. Admin: events')
export class EventsController {
  constructor(
    private eventsService: EventsService,
    private agenciesService: AgenciesService,
  ) {}

  @Post()
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
  async create(@CurrentUser() currentUser, @Body() body: CreateEventDto) {
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
  findOne(@Param() { id }: IdDto) {
    return this.eventsService.findOne(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [Event],
  })
  async findAll(@Query('agencyId') agencyId?: string) {
    const agency = agencyId
      ? await this.agenciesService.findOne(parseInt(agencyId))
      : null;
    return this.eventsService.findAll(agency);
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
  update(
    @CurrentUser() currentUser,
    @Param() { id }: IdDto,
    @Body() body: UpdateEventDto,
  ) {
    return this.eventsService.update(id, body, currentUser);
  }

  @Delete(':id')
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
  async remove(@CurrentUser() currentUser, @Param() { id }: IdDto) {
    return this.eventsService.remove(id, currentUser);
  }
}
