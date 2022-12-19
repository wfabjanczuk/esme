import {
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
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { EventsService } from '../events/events.service';
import { IssuesService } from './issues.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Issue } from './issue.entity';
import { CreateIssueDto } from './dtos/create-issue.dto';
import { UpdateIssueDto } from './dtos/update-issue.dto';
import { IdDto } from '../../common/dtos/id.dto';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('issues')
@UseGuards(AuthenticationGuard, AdminGuard)
@ApiTags('1. Admin: issues')
export class IssuesController {
  constructor(
    private eventsService: EventsService,
    private issuesService: IssuesService,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    type: Issue,
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
  async create(@CurrentUser() currentUser, @Body() body: CreateIssueDto) {
    const event = await this.eventsService.findOne(body.eventId);
    return this.issuesService.create(body, event, currentUser);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Issue,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Issue with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param() { id }: IdDto) {
    return this.issuesService.findOne(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [Issue],
  })
  async findAll(@Query('eventId') eventId?: string) {
    const event = eventId
      ? await this.eventsService.findOne(parseInt(eventId))
      : null;
    return this.issuesService.findAll(event);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: Issue,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Issue with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  update(
    @CurrentUser() currentUser,
    @Param() { id }: IdDto,
    @Body() body: UpdateIssueDto,
  ) {
    return this.issuesService.update(id, body, currentUser);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: Issue,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Issue with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  async remove(@CurrentUser() currentUser, @Param() { id }: IdDto) {
    return this.issuesService.remove(id, currentUser);
  }
}
