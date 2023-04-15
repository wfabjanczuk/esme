import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FindEventsDto } from './dtos/find-events.dto';
import { ApiEventsService } from './api-events.service';
import { Event } from '../events/event.entity';
import { IdDto } from '../../common/dtos/id.dto';

@Controller('api/events')
@UseGuards(AuthGuard('bearer-api-key'))
@ApiTags('3. Api: events')
export class ApiEventsController {
  constructor(private apiEventsService: ApiEventsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: [Event],
  })
  findAll(@Query() options: FindEventsDto) {
    return this.apiEventsService.findAll(options);
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
    return this.apiEventsService.findOne(id);
  }
}
