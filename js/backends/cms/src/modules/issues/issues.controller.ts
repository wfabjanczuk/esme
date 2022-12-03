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
import { AuthGuard } from '../../guards/auth.guard';
import { EventsService } from '../events/events.service';
import { IssuesService } from './issues.service';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Issue } from './issue.entity';
import { CreateIssueDto } from './dtos/create-issue.dto';
import { UpdateIssueDto } from './dtos/update-issue.dto';

@Controller('issues')
@ApiTags('Issues')
@UseGuards(AuthGuard)
export class IssuesController {
  constructor(
    private eventsService: EventsService,
    private issuesService: IssuesService,
  ) {}

  @Post('')
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
  findOne(@Param('id') id: string) {
    return this.issuesService.findOne(parseInt(id));
  }

  @Get('')
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
    @Param('id') id: string,
    @Body() body: UpdateIssueDto,
  ) {
    return this.issuesService.update(parseInt(id), body, currentUser);
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
  async remove(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.issuesService.remove(parseInt(id), currentUser);
  }
}
