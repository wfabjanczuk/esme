import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SearchEventsDto } from './dtos/search-events.dto';
import { ApiEventsService } from './api-events.service';

@Controller('api')
@UseGuards(AuthGuard('bearer'))
@ApiTags('3. Api: events')
export class ApiEventsController {
  constructor(private apiEventsService: ApiEventsService) {}

  @Get('events')
  @ApiResponse({
    status: 200,
  })
  placeholder(@Query() options: SearchEventsDto) {
    return this.apiEventsService.searchEvents(options);
  }
}
